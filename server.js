const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile( __dirname + '/index.html' );
})

app.listen( port, (err, data) => console.log(`Silver's listenning on port: ${port}`));