const express = require('express');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './config/app.env'});

const app = express();


app.use(express.static(process.env.FRONTEND_DIST_PATH));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, process.env.FRONTEND_DIST_PATH, 'index.html'))
});

app.listen(process.env.NODE_PORT, () => {
    console.log(`App listening at http://localhost:${process.env.NODE_PORT}`)
});
