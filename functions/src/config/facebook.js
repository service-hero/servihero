const { FacebookAdsApi } = require('facebook-nodejs-business-sdk');
require('dotenv').config();

const FB_CONFIG = {
  appId: process.env.FACEBOOK_APP_ID || '428843036166500',
  appSecret: process.env.FACEBOOK_APP_SECRET || 'd41b8d30e1f2f0c157f145f89121f53a',
  apiVersion: 'v18.0'
};

const initializeFacebookApi = () => {
  try {
    const api = FacebookAdsApi.init(FB_CONFIG.appId, FB_CONFIG.appSecret);
    api.setApiVersion(FB_CONFIG.apiVersion);
    return api;
  } catch (error) {
    console.error('Failed to initialize Facebook API:', error);
    throw new Error('Facebook API initialization failed');
  }
};

const getAppAccessToken = async () => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/oauth/access_token?client_id=${FB_CONFIG.appId}&client_secret=${FB_CONFIG.appSecret}&grant_type=client_credentials`
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get app access token:', error);
    throw new Error('Failed to get Facebook access token');
  }
};

module.exports = {
  initializeFacebookApi,
  getAppAccessToken,
  FB_CONFIG
};