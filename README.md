# Webpack Deep Diving
A personnal project aiming to understand as much as possible the module bundler that is webpack.  

**[W E B P A C K](https://webpack.org):**  
**Webpack** is a module bundler: it processes various kind of files in order to output them in one ore more bundle(s).  
It allows to optimise your app by reducing its weight, allows to transform, translate, compile your throught
 your written configuration, using *dependency graph* ( =>.

**Tasks summary**
|------------------------------|
| **bundle** files and assets  |
| **manage** dependencies      |

## :rocket: QUICK SETTUP
:warning: GOOD TO KNOW:
- current version: **4**
- requires a **```src``` folder**
- requires an **```index.js``` file inside ```src```**;
- output expected in ```dist``` : ```main.js```


### :round_pushpin: Install:
- webpack:```npm install --save-dev webpack webpack-cli``` 
- express: ```npm install express```


### :round_pushpin: Small setting adjustments:
- create your directory **```src```**
- ... in wich you create an **```index.js```**
- in **package.json** add a script:
    ```"build": "webpack",```
- in ```.gitignore```: add ```dist``` and ```node_modules``` alowing to ignore those folders
- in ```server.js```:
    ```javascript
    const express = require('express');
    const app = express();
    const url = 'http://localhost:',
          port = 3000;

    // build-in middleware function serving static files
    app.use(express.static( __dirname, 'dist')) ( resolving path for all static files )
    
    app.get('/', (req, res) => res.sendFile( __dirname,'index.js')
    app.listen('/', (err, data) => {
        if(!err){
            console.log(`Silver's listening at ${url}${port}`
        }
    }
    ```
- in ```index.html```, before the ending body tag: 
    ```html
    <script src="main.js"></script>
    ```
NB: At this stage, webpack is not requiring any config ( unlike the previous webpack versions with ```webpack.config.js``` ).


Verification:
Now if you run in your terminal ```npm build```, you should notice a new directory ```dist``` just created in which one there is a ```main.js``` file.  
And then when you launch your server everything works fine --> ```npm start```

## :wrench: CONFIGURATION:
### :diamond_shape_with_a_dot_inside: INITIATE DEFAULT BEHAVIOR CONFIGURATION
So far, we did the just required setting to enable **webpack default behavior**.  
From now on, we'll get into the **real configuration and replicate this default behavior**:
- create ```webpack.config.js```
- init the config:
    ```javascript
    //./webpack.config.js
    const path = require('path');                           // module resolving paths
    module.exports = {                                      // config. init here
            mode: "development",                            
            entry: "./src/index.js",
            output: {
                filename: "main.js",
                path: path.resolve(__dirname, "dist")       // __dirname is global
            },
    }
    ```
- in ```package.json```: change start script:
    ```json
        ./package.json
        scripts: {
                    "start": "node server.js"
                    "build": "webpack --config webpack.config.js
                }
    ```


#### What is happening within webpack.config.js ?
The general Webpack behavior is to check if there is any config file ( cf.: webpack.config.js ),
if not it will run its default behavior through the cli ```webpack``` : requiring ```src``` & ```src/index.js``` to build the ```dist``` folder with its bundle ```main.js```  
**First steps:** webpack default configuration process
-  ```"entry"``` tells webpack where to look to initiate its bundle
-  ```"output"``` tells where to return what it just created from your code
-  ```"mode"``` tells how it should display the main.js code ( as minified 
for production mode ( default behavior if not specified ) or a readable 
version with development mode ).

**Next steps:** customise your configuration
- ```"module"``` tells what to transform different files according to ```"rules"``` using ```"loaders"```
- ```"plugins"``` customises webpack process behavior

### :diamond_shape_with_a_dot_inside: LOADERS
#### What are loaders ?
Loaders in ```rules``` are kind of 'tasks' or helpers that outputs/transforms differents languages your project uses ( css, sass, json, typescript etc ... ) into commonJS or else.
    
- Sass requires :
    - ```style-loader```: creating style nodes from JS strings
    - ```css-loader```: translate css into CommonJS
    - ```sass-loader```: compile sass into css
    - ```node-sass```: required by sass-loader to complete its compiling
    
#### How ?
Setting Sass in ```webpack.config.js```:  
 ```javascript
    //./webpack.config.js
    //...
    module: {
        rules: [
            {
                test: /\.scss$/,        // regexp testing files ending by .scss
                use: [
                    "style-loader",     // 3. inject css into html
                    "css-loader",       // 2. turns css into commonjs
                    "sass-loader"       // 1. turns sass into css
                ]
            }
        ]
    }
 ```

### :diamond_shape_with_a_dot_inside: CACHING AND PLUGINS
#### What is caching and plugins ?
Caching is when a browser store a file and use it for next refreshes ( which actually helps the browser to reload faster ).
However, in this case, our dynamic ```main.js``` file here will be stored at first then, the browser will check if there are different filename, if not it will must likely take the one in the cache ( even though we did changed some code within )
So from now on we will set the environment to rebuild the whole html + inject dynamically the main.js file , all that thanks to plugins.

Plugins give the options to customize webpack's building process, and in this case with html-webpack-plugin, will add a hash-content allowing to tell that even though the finename is the same, if there is any changes, this very file did changed.

#### How?
Html-webpack-plugin: ``` npm install --save-dev html-webpack-plugin``` --> for each build, recreating an html file with hash-content if any changes have been made.
But there are plenty more and you can also bind a templater ( ejs, pug, mustache, etc ...)

- delete your index.html in the root ( cause webpack will no use it anymore with this plugin)
- go to ```src```and create a ```template.html``` ( that our plugin will use )
- write your html without the script linking to our ```main.js``` file as webpack will inject the correct file
- in webpack add:
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
...
plugins: [
    new HtmlWebpackPlugin({
        template: './src/template.html'
    })
]
```
- then modify the output property to add the **hash content**:
``` 
...
output: {
    ...
    filename: 'main[contentHash].js'
}
```

NB: ```new HtmlWebpackPlugin()``` without argument will auto generate an html ( not taking care of the html you painfully wrote :p )
Later on run your ```npm run build``` and now you should be able to see within your ```dist``` an html created as ```index.html```



### :diamond_shape_with_a_dot_inside: SPLIT CONFIG ACCORDING TO DEV MODE - DEVELOPMENT OR PRODUCTION
#### What are those modes?
- **DEVELOPMENT**: corresponds to the usual local development mode flow meaning your code will be with comment, well indented, readable, have the hot reloading, with bundle/build faster, uses localhost, etc ...
- **PRODUCTION**: corresponds to your environment optimised meaning your code could be comments free, minimized and optmised, build slower, compressed etc ...

#### How ?
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
    ```

| FILE                      | webpack.dev.js    | webpack.prod.js              |
| ------------------------- |:-----------------:| ----------------------------:|
| "mode":                   | "development"     | "production"                 |
| "output": ..."filename":  | "main.js"         | "main-[contentHash].js      |

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
### :diamond_shape_with_a_dot_inside: HOT RELOADING
#### What is hot reloading ?
Hot reloading is the fact that, in this case, you'll not manually build each time your webpack whenever you modify anyfile.
In here webpack-dev-server will allow you to apply any changes to your files and webpack-dev-server will rebuild everytime you hit "ctrl + s"
allowing you to improve your developping workflow.

#### How ?
- install webpack-dev-server: ```npm install --save-dev webpack-dev-server````
- adjust your ```package.json``` file:
    ```
    "start": "webpack-dev-server --config webpack.dev.js --open"
    ```

### :diamond_shape_with_a_dot_inside: EXTRA USEFULL LOADERS
- ```file-loader```: Emits the file into the output folder and returns the (relative) URL
- ```html-loader```: Exports HTML as string. HTML is minimized when the compiler demands.
- set the rules ( as previously done ) you can add extra options too, check the doc for those two

### :diamond_shape_with_a_dot_inside: EXTRA USEFULL PLUGIN
- ```clean-webpack-plugin```: aim to clean/remove your build folder(s)


### :diamond_shape_with_a_dot_inside: MULTIPLE ENTRY POINT
#### What is multiple entry for ?
Let's say you are working with vendor file ( == to third-party assets convention name )

#### How ?
- in ```webpack.config.js```: entry will become an object where you'll define proprieties corresponding to each file path:
    ```entry: {
            main: './src/index.js,
            vendor: './src/vendor.js'
       }
    ````
- in ```webpack.dev.js``` and ```webpack.prod.js``` modify the output filename with dynamic value, add [contentHash] for the prod mode
    ```
    ...
    output: {
        filename: "[name]-bundle.js",
        ...
    }


### :diamond_shape_with_a_dot_inside: EXTRACT STYLE FILES
#### Why exctracting styles from the js file generated?
Currently the style is actually loaded in the same time as the javascript ( which is at the end, once all html has been loaded) cause it is included to this javascript file on the bottom of your html file as usual. That is why it is better to keep files seperated ( at least in production mode ), for better performences.

####How ?
By exctracting the style inside a css file which will be auto generated by the plugin ```mini-css-extract-plugin```
- install : ```npm install --save-dev mini-css-extract-plugin```;
- in ```webpack.prod.js`` add the plugin:
    ```
    ...
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    ...
    plugins: [
        ...
        new MiniCssExtractPlugin({
            filename: "[name]-[contentHash].css
        })
    ]
    ```

Now, since we need to extract the style, we need to pay attention to our old friend ```style-loader``` which actually its work is to inject this style into our javascript file.
So now we need to isolate this commonly used rule ( in ```webpack.config.js```) for each case:
- in ```webpack.dev.js```
    ```
    ...
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
            }
        ]
    }
    ```
- in ```webpack.prod.js```:
    ```
    ...
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // Move/Extract css into files
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
    ```
Now we should expect: a css file within dist folder ( generated by webpack );
