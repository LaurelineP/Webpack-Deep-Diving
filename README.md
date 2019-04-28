# Webpack Deep Diving
A personnal project aiming to understand as much as possible the module bundler that is webpack.
Webpack is a module bundler which means it processes plainty of files with various extensions 
and outputs them in x files ( according to what you could configure ) but definitively fewer 
than all you already have: cf "bundle"
- bundles files and assets
- manages dependencies.

## Installation
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
    - style-loader: creating style nodes from JS strings
    - css-loader: translate css into CommonJS
    - sass-loader: compile sass into css
    - node-sass: required by sass-loader to complete its compiling
    - / ! \ NB: currently when you install node-sass: this one is depending on node-gyp which depends on tar which currently have a patching issue so npm audit warns you of a high security vulnerability
    - / ! \ will continue without taking care of the error --> will need to come back and check that later.


## CACHING AND PLUGINS:
Caching is when a browser store a file on refresh ( which actually helps the browser to reload faster ).
However, here it is a main.js which could be reload and cached and this file get to be rebuild on code changed and save ( the browser at the point makes no differences because it's not looking inside the file, just the name )
So from now on we will set the environment to revuild the whole html + inject dynamically the main.js file , all that thanks to a plugins

Plugins give the options to customize webpack's building process

### Installation :
Html-webpack-plugin: ``` npm install --save-dev html-webpack-plugin``` --> for each build, recreating an html file with hashcontent if any changes have been made.
But there are plenty more and you can also bind a templater ( ejs, pug, mustache, etc ...)
- delete your index.html in the root
- go to ```src```and create a ```template.html``` that our plugin will use
- write your html without the script as webpack will inject the correct file
- in webpack add:
``
const HtmlWebpackPlugin = reuqire('html-webpack-plugin');
...
plugins: [
    new HtmlWebpackPlugin({
        template: './src/template.html'
    })
]
```
Later on run your ```npm run build``` and now you should be able to see within your ```dist``` an html created as ```index.html```