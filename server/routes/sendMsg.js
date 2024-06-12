import express from 'express';
import axios from 'axios';
import dotenv from "dotenv";
import { htmlToText } from 'html-to-text';

export const router = express.Router();

dotenv.config();

// Function to convert HTML to plain text
function convertHtmlToPlainText(html) {
 return htmlToText(html, {
    wordwrap: false,
    ignoreHref: true,
    ignoreImage: true,
 });
}

// Change here: Use '/' instead of '/api/sendmsg'
router.post('/', async (req, res) => {
 const { tid, from, to, sms } = req.body;
 const apiUrl = process.env.SMS_API_URL; // Make sure this is defined in your .env file

 // Convert HTML to plain text
 const plainTextSms = convertHtmlToPlainText(sms);

 try {
    const data = {
      type: "send-sms",
      task_num: 1,
      tasks: [{
        tid: tid,
        from: from,
        to: to,
        sms: plainTextSms // Use the converted plain text
      }]
    };

    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    res.json({ success: true, data: response.data });
 } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ success: false, message: "Failed to send SMS", error: error.message });
 }
});
