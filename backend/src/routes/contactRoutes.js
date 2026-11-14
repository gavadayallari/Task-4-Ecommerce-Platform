const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, orderId, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
      });
    }

    const ticketId = `SN-TKT-${Date.now().toString().slice(-6)}`;

    // In production this would send email/save to CRM
    res.status(200).json({
      success: true,
      ticketId,
      message: `Thank you, ${name}! Your support request (${ticketId}) has been received. Our Indian support team will reach out within 24 hours.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error processing contact form' });
  }
});

module.exports = router;

