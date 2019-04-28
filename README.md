# Webpack Deep Diving
A personnal project aiming to understand as much as possible the module bundler that is webpack.
Webpack is a module bundler which means it processes plainty of files with various extensions 
and outputs them in x files ( according to what you could configure ) but definitively fewer 
than all you already have: cf "bundle"
- bundles files and assets
- manages dependencies.

## START WEBPACK INSTALLATION
Good to know:
- current version: 4
- requires a ```src``` folder
- requires an ```index.js``` file inside ```src```;
- output expected in ```dist``` : ```main.js```


Install:
- webpack:```npm install --save-dev webpack webpack-cli```
- express: ```npm install express```


Small setting adjustment:
- create your directory at the root: src
- ... in wich you create an ```index.js```
- in package.json add a script: ```"build": "webpack",```
- in .gitignore: add ```dist``` ( this folder will be rebuild each time you run the command )
- in server.js: ```app.use(express.static( __dirname, 'dist'))``` ( resolving path for all static files )
- in index.html, before the ending body tag: ```<script src="main.js"></script>```
NB: At this stage, webpack is not requiring any config ( unlike the previous webpack versions with ```webpack.config.js``` ).


Verification:
Now if you run on your terminal ```npm build```: you should be able to notice that a directory ```'dist'``` was created in which one there is a ```main.js```.
And then when you launch your server everything works fine.

## CONFIGURATION:
### Init configuration: default behavior
So far, we did the just required setting to enable webpack default behavior.
From now on, we'll get into the real configuration and replicate this default behavior:
- create ```webpack.config.js```
- add those lines to this file:
    ``` 
    const path = require('path');
    module.exports = {
            mode: "development",
            entry: "./src/index.js",
            output: {
                filename: "main.js",
                path: path.resolve(__dirname, "dist")
            }
    }
    ```
- in package.json: change start script:
    ```"build": "webpack --config webpack.config.js"```


#### What is happening within webpack.config.js ?
The general Webpack behavior is to check if there is any config file ( cf.: webpack.config.js ),
if not it will run its default behavior through the cli ```webpack``` : requiring ```src``` & ```src/index.js``` to build the ```dist``` folder with its bundle ```main.js```
Here on the first step of this stage we created a webpack config
and the second step is the definition of the behavior we are expecting:
-  ```"entry"``` tells webpack where to look to initiate its bundle
-  ```"output"``` tells where to return what it just created from your code
-  ```"mode"``` tells how it should display the main.js code ( as minified 
for production mode ( default behavior if not specified ) or a readable 
version with development mode ).

### Configurations with loaders
#### What is loaders ?
    Loaders are kind of 'tasks' or helpers that outputs/transform Javascript code from the differents languages your project uses ( css, sass, json, typescript etc ... ).
    
- Sass requires :
    - ```style-loader```: creating style nodes from JS strings
    - ```css-loader```: translate css into CommonJS
    - ```sass-loader```: compile sass into css
    - ```node-sass```: required by sass-loader to complete its compiling

To keep going setting Sass:
    ```
    ...
    module: {
        rules: [
            {
                test: /\.scss$/,        // regex testing files ending by .scss
                use: [
                    "style-loader",     // 3. inject css into html
                    "css-loader",       // 2. turns css into commonjs
                    "sass-loader"       // 3. turns sass into css
                ]
            }
        ]
    }
    ```

## CACHING AND PLUGINS:
Caching is when a browser store a file and use it for next refreshes ( which actually helps the browser to reload faster ).
However, in this case, our dynamic ```main.js``` file here will be stored at first then, the browser will check if there are different filename, if not it will must likely take the one in the cache ( even though we did changed some code within )
So from now on we will set the environment to rebuild the whole html + inject dynamically the main.js file , all that thanks to plugins.

Plugins give the options to customize webpack's building process, and in this case with html-webpack-plugin, will add a hash-content allowing to tell that even though the finename is the same, if there is any changes, this very file did changed.

### Installation :
Html-webpack-plugin: ``` npm install --save-dev html-webpack-plugin``` --> for each build, recreating an html file with hash-content if any changes have been made.
But there are plenty more and you can also bind a templater ( ejs, pug, mustache, etc ...)

- delete your index.html in the root ( cause webpack will no use it anymore with this plugin)
- go to ```src```and create a ```template.html``` ( that our plugin will use )
- write your html without the script linking to our ```main.js``` file as webpack will inject the correct file
- in webpack add:
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
...
plugins: [
    new HtmlWebpackPlugin({
        template: './src/template.html'
    })
]
```
- then modify the output property to add the hash content:
``` 
...
output: {
    ...
    filename: 'main[contentHash].js'
}
```

NB: new HtmlWebpackPlugin() without argument will auto generate an html ( not taking care of the html you painfully wrote :p )
Later on run your ```npm run build``` and now you should be able to see within your ```dist``` an html created as ```index.html```



## SPLIT CONFIG ACCORDING TO DEV MODE - DEVELOPMENT OR PRODUCTION:
### What are those modes?
- DEVELOPMENT: corresponds to the usual local development mode flow meaning your code will be with comment, well indented, readable, have the hot reloading, with bundle/build faster, uses localhost, etc ...
- PRODUCTION: corresponds to your environment optimised meaning your code could be comments free, minimized and optmised, build slower, compressed etc ...

### How?
We will need to split the config by there eponym tasks and we'll get three config we will merge using webpack-merge package.
- webpack-merge: ```npm install --save-dev webpack-merge```
- we will keep the common config as ```webpack.config.js```;
- we'll add 2 files : ```webpack.dev.js``` ( for development mode ) and ```webpack.prod.js``` ( for production mode );
- now we will split the config between those three files:
- in ```webpack.config.js``` we will keep: [ entry, module and plugins ] so we are getting rid of [ mode, output ( which depend on dev or prod )]
- then write for each the [ mode and output and import the 'global' config ].
```
const merge = require('webpack-merge');
const config = require('./webpack.config');

| FILE                      | webpack.dev.js    | webpack.prod.js              |
| ------------------------- |:-----------------:| ----------------------------:|
| "mode":                   | "development"     | "production"                 |
| "output": ..."filename":  | "main.js"         | "main-\[contentHash].js      |
```

- then replace your module.exports line with:
```
module.exports = merge( config, {
    ....
})
```
- then adjust your ```package.json``` file scripts to set ```npm start``` command as development mode and ```npm run prod```, a command as production mode.
```
...
"scripts": {
    "start": "webpack --config webpack.dev.js",
    "prod": "webpack --config webpack.prod.js"
}
```