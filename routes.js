const express = require('express');
const routes = express.Router();

const BotController = require('./controllers/BotController');

//Busca Lead
routes.post('/api/botForm/', BotController.post);



module.exports = routes;
