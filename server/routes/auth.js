const express = await import('express');
const router = express.Router();

const {login } = await import('../controllers/auth.js');


router.post('/login', login);

// module.exports = router;
export {router};