const axios = require('axios');
const ghlConfig = require('../config/ghl');

class GHLService {
  constructor() {
    this.axios = axios.create({
      baseURL: ghlConfig.getBaseUrl(),
      headers: ghlConfig.getHeaders()
    });
  }

  async getContacts(query = {}) {
    try {
      const response = await this.axios.get('/contacts', { params: query });
      return response.data;
    } catch (error) {
      console.error('Error fetching GHL contacts:', error);
      throw new Error('Failed to fetch contacts from GHL');
    }
  }

  async createContact(contactData) {
    try {
      const response = await this.axios.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating GHL contact:', error);
      throw new Error('Failed to create contact in GHL');
    }
  }

  async updateContact(contactId, contactData) {
    try {
      const response = await this.axios.put(`/contacts/${contactId}`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating GHL contact:', error);
      throw new Error('Failed to update contact in GHL');
    }
  }

  async getOpportunities(query = {}) {
    try {
      const response = await this.axios.get('/opportunities', { params: query });
      return response.data;
    } catch (error) {
      console.error('Error fetching GHL opportunities:', error);
      throw new Error('Failed to fetch opportunities from GHL');
    }
  }

  async createOpportunity(opportunityData) {
    try {
      const response = await this.axios.post('/opportunities', opportunityData);
      return response.data;
    } catch (error) {
      console.error('Error creating GHL opportunity:', error);
      throw new Error('Failed to create opportunity in GHL');
    }
  }
}

module.exports = new GHLService();