const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs')
const { PORT } = require('./constants');
const BotController = require('./controllers/BotController');



const app = express();
// const routes = require('./routes.js')

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/api/botForm/", BotController.post)

app.listen(PORT, () => {
    console.log(`Example app listening at :${PORT}`)
})