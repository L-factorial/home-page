const express = require('express');
const bodyParser = require('body-parser');

const routeHandler = require('./routes/handler.js');
const path = require('path');

// const cors = require('cors');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '/front-end/build')));
app.use('/', routeHandler);

//const PORT = 4000; // backend routing port
const PORT = 8080; // changed to debug eb 502 gateway

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
