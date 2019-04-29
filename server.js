const express = require('express');
const app = express();
const port = 3000;
const url = 'http://localhost:';

app.use( express.static('dist') );

/* Using webpack: there is no use for the bloc bellow */
// app.get('/', (req, res) => {
//     res.sendFile( __dirname + '/index.html' );
// })

app.listen( port, ( err, data ) => console.log(`Silver's listenning on port: ${url}${port}`));