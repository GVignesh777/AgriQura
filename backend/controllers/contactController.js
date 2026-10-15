const ContactMessage = require('../database/models/ContactMessage');
const {
  sendContactConfirmationEmail,
  sendSupportTeamNotification
} = require('../services/emailService');

// In-memory fallback if MongoDB connection is temporarily unavailable
const inMemoryMessages = new Map();

/**
 * Generate unique reference ticket ID in format AQ-2026-XXXXX
 */
const generateTicketId = () => {
  const year = new Date().getFullYear();
  const randomSeq = Math.floor(10000 + Math.random() * 90000);
  return `AQ-${year}-${randomSeq}`;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @route   POST /api/contact
 * @desc    Submit a new contact message and generate a support ticket
 */
exports.submitContactMessage = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      userType = 'Farmer',
      subject,
      message,
      attachment,
      voiceMessage,
      honeypot
    } = req.body;

    // Basic anti-spam honeypot check
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Message received' });
    }

    // 1. Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Subject/Reason is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message description is required' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long' });
    }

    // 2. Validate Attachment (if provided)
    if (attachment && attachment.fileSize && attachment.fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'Attachment exceeds maximum size of 5MB' });
    }

    // 3. Generate Ticket ID
    let ticketId = generateTicketId();

    const messageData = {
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      userType,
      category: subject,
      subject: subject.trim(),
      message: message.trim(),
      attachment: attachment || null,
      voiceMessage: voiceMessage || null,
      status: 'New',
      ipAddress: req.ip || req.connection?.remoteAddress || null
    };

    // 4. Save to Database
    try {
      const savedDoc = await ContactMessage.create(messageData);
      ticketId = savedDoc.ticketId;
    } catch (dbErr) {
      console.warn('⚠️ [Contact Controller]: MongoDB write fallback to memory:', dbErr.message);
      inMemoryMessages.set(ticketId, messageData);
    }

    // 5. Send EmailJS Notifications
    // (a) Confirmation email directly to the farmer/user
    try {
      await sendContactConfirmationEmail(
        email.trim().toLowerCase(),
        ticketId,
        name.trim(),
        subject.trim(),
        message.trim()
      );
      console.log(`📩 [User Confirmation Sent]: Ticket ${ticketId} to ${email}`);
    } catch (userEmailErr) {
      console.warn('⚠️ [User Confirmation Warning]:', userEmailErr.message);
    }

    // (b) New inquiry alert directly to Admin/Support Team (agriqura@gmail.com)
    try {
      await sendSupportTeamNotification(messageData);
      console.log(`📩 [Admin Support Alert Sent]: Ticket ${ticketId} to support inbox`);
    } catch (adminEmailErr) {
      console.warn('⚠️ [Admin Notification Warning]:', adminEmailErr.message);
    }

    res.status(201).json({
      success: true,
      ticketId,
      message: 'Message Sent Successfully',
      supportEmail: 'agriqura@gmail.com',
      expectedReview: 'Most inquiries are reviewed as soon as possible by our agricultural support team.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/contact/status/:id
 * @desc    Check status of an existing support ticket
 */
exports.getTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    let ticket = null;
    try {
      ticket = await ContactMessage.findOne({ ticketId: id.trim() }).select('-ipAddress').lean();
    } catch (err) {
      // ignore
    }

    if (!ticket && inMemoryMessages.has(id)) {
      ticket = inMemoryMessages.get(id);
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `Support ticket with Reference ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      ticket: {
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        category: ticket.category,
        userType: ticket.userType,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
