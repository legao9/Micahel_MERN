const express = require('express');
const router = express.Router();

const {getUserInfo} = require('../controllers/getUserInfo');


router.get('/:token', getUserInfo);

module.exports =(router);