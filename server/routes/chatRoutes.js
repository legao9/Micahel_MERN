const express =  await import  ("express");
export const router = express.Router();
const { Messages,getTestMessages,getUsersAndLastMessages, saveMsg,UpdateMsgs } = await import("../controllers/Messages.js");

// router.get("/getMessage/:token", Messages);

// router.post("/getTestMessages",getTestMessages);
router.post("/sendMsg",saveMsg)
router.post("/getUsersAndLastMessages",getUsersAndLastMessages);
router.post("/UpdateMsgs",UpdateMsgs);
