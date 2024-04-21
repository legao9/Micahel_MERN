const express = await import('express');
export const router = express.Router();

const {getUserInfo} = await import('../controllers/getUserInfo.js');


router.get('/:token', getUserInfo);

// module.exports =(router);