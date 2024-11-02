const { Lead, Page } = require('facebook-nodejs-business-sdk');
const { getAppAccessToken } = require('../config/facebook');

class FacebookLeadService {
  constructor() {
    this.accessToken = null;
  }

  async initialize() {
    if (!this.accessToken) {
      this.accessToken = await getAppAccessToken();
    }
  }

  async getLeads(pageId, formId = null, startDate = null, endDate = null) {
    await this.initialize();

    try {
      const page = new Page(pageId);
      let query = page.getLeads();

      if (formId) {
        query = query.where({ form_id: formId });
      }

      if (startDate) {
        query = query.where({ created_time_gt: startDate });
      }

      if (endDate) {
        query = query.where({ created_time_lt: endDate });
      }

      const leads = await query.fetch();

      return leads.map(lead => this.formatLead(lead));
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw new Error('Failed to fetch leads from Facebook');
    }
  }

  async getLeadForms(pageId) {
    await this.initialize();

    try {
      const page = new Page(pageId);
      const forms = await page.getLeadGenForms().fetch();

      return forms.map(form => ({
        id: form.id,
        name: form.name,
        status: form.status,
        createdTime: form.created_time,
        locale: form.locale,
        pageId: form.page_id
      }));
    } catch (error) {
      console.error('Error fetching lead forms:', error);
      throw new Error('Failed to fetch lead forms from Facebook');
    }
  }

  formatLead(lead) {
    return {
      id: lead.id,
      formId: lead.form_id,
      createdTime: lead.created_time,
      data: lead.field_data.reduce((acc, field) => {
        acc[field.name] = field.values[0];
        return acc;
      }, {}),
      pageId: lead.page_id,
      adId: lead.ad_id,
      adsetId: lead.adset_id,
      campaignId: lead.campaign_id
    };
  }
}

module.exports = new FacebookLeadService();