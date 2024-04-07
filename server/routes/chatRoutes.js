const express = require("express");
const router = express.Router();
const { Messages,getTestMessages } = require("../controllers/Messages");

// router.get("/getMessage/:token", Messages);

// router.post("/pushMessage/:token")
router.post("/getTestMessages",getTestMessages);

module.exports = router;
