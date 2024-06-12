import model from '../model/model.js';

export const markConversationDeleted = async (req, res) => {
    const { phoneNumber, isDeleted } = req.body;
    try {
      const modelInstance = await model();
      await modelInstance.markConversationDeleted(phoneNumber, isDeleted);
      res.status(200).json({ message: 'Conversation marked as deleted/undeleted successfully.' });
    } catch (error) {
      console.error('Error marking conversation as deleted/undeleted:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const markConversationRead = async (req, res) => {
  const { phoneNumber, isRead } = req.body;
  try {
    const modelInstance = await model();
    await modelInstance.markConversationRead(phoneNumber, isRead);
    res.status(200).json({ message: 'Conversation marked as read/unread successfully.' });
  } catch (error) {
    console.error('Error marking conversation as read/unread:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};