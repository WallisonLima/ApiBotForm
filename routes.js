const express = require('express');
const routes = express.Router();

const BotController = require('./controllers/BotController');

//Busca Lead
routes.post('/api/botForm/', BotController.post);
routes.get('/api/teste/', BotController.onServer);



module.exports = routes;
