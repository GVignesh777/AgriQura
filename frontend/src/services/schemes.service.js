import api from './api';

export const schemesService = {
  /**
   * Get all schemes with query filters & pagination
   */
  async getSchemes(params = {}) {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  /**
   * Get single scheme by ID
   */
  async getSchemeById(id) {
    const res = await api.get(`/schemes/${id}`);
    return res.data;
  },

  /**
   * Get distinct states list with count
   */
  async getStates() {
    const res = await api.get('/schemes/states');
    return res.data;
  },

  /**
   * Get scheme categories
   */
  async getCategories() {
    const res = await api.get('/schemes/categories');
    return res.data;
  },

  /**
   * Match schemes against farmer wizard profile
   */
  async matchSchemes(profileData) {
    const res = await api.post('/schemes/match', profileData);
    return res.data;
  },

  /**
   * Explain scheme via Groq Llama-3 AI Assistant
   */
  async explainSchemeAI(data) {
    const res = await api.post('/schemes/explain-ai', data);
    return res.data;
  },

  /**
   * Get farmer saved schemes (Auth required)
   */
  async getSavedSchemes() {
    const res = await api.get('/schemes/saved');
    return res.data;
  },

  /**
   * Bookmark scheme (Auth required)
   */
  async saveScheme(schemeData) {
    const res = await api.post('/schemes/saved', schemeData);
    return res.data;
  },

  /**
   * Update personal tracker application status (Auth required)
   */
  async updateApplicationStatus(schemeId, updateData) {
    const res = await api.patch(`/schemes/saved/${schemeId}`, updateData);
    return res.data;
  },

  /**
   * Remove scheme from saved bookmarks (Auth required)
   */
  async removeSavedScheme(schemeId) {
    const res = await api.delete(`/schemes/saved/${schemeId}`);
    return res.data;
  },

  /**
   * Get sync status & source info
   */
  async getSyncStatus() {
    const res = await api.get('/schemes/sync-status');
    return res.data;
  }
};

export default schemesService;
