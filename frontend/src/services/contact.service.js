import api from './api';

export const contactService = {
  /**
   * Submit a new contact message and receive a ticketId
   */
  async submitContact(formData) {
    const res = await api.post('/contact', formData);
    return res.data;
  },

  /**
   * Check status of a ticket by reference ID
   */
  async getTicketStatus(ticketId) {
    const res = await api.get(`/contact/status/${ticketId}`);
    return res.data;
  }
};

export default contactService;
