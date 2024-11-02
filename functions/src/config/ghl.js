const GHL_CONFIG = {
  baseUrl: 'https://rest.gohighlevel.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};

class GHLConfig {
  constructor() {
    this.apiKey = process.env.GHL_API_KEY;
  }

  getHeaders() {
    return {
      ...GHL_CONFIG.defaultHeaders,
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  getBaseUrl() {
    return GHL_CONFIG.baseUrl;
  }
}

module.exports = new GHLConfig();