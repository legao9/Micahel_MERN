import express from 'express';
import { markConversationDeleted, markConversationRead } from '../controllers/conversations.js';


const router = express.Router();

router.post('/markConversationDeleted', markConversationDeleted);
router.post('/markConversationRead', markConversationRead);

export { router as conversationRoutes };