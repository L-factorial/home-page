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

const PORT = 4000; // backend routing port

// Index route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/front-end/build', 'index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
//Triggering the build ....

