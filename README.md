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
- requires a src folder
- requires an index.js file inside this last one;
- output expected './dist/main.js'

Install:
- webpack:```npm install --save-dev webpack webpack-cli```
- express: ```npm install express```

Small setting adjustment:
- create your directory at the root: src
- ... in wich you create an ```index.js```
- in package.json: ```"start": "webpack",```
- in .gitignore: dist (as dist will be rebuild each time )
- in server.js: ```app.use(express.static('dist'))``` ( resolving path for all static files )
- in index.html, before the ending body tag: ```<script src="main.js"></script>```
NB: At this stage, webpack is not requiring any config ( unlike the previous webpack versions with ```webpack.config.js``` ).

Verification:
Now if you run on your terminal ```npm start```: you should be able to notice that a directory 'dist' was created in which one there is a main.js.
And then when you launch your server everything works fine.