import API from './api';

export const analyticsService = {
  getSummary: async () => {
    const res = await API.get('/analytics/summary');
    return res.data;
  },

  getByCategory: async () => {
    const res = await API.get('/analytics/by-category');
    return res.data;
  },

  getMonthlyTrend: async () => {
    const res = await API.get('/analytics/monthly-trend');
    return res.data;
  },

  getRecent: async () => {
    const res = await API.get('/analytics/recent');
    return res.data;
  },

  getCashflowCalendar: async () => {
    const res = await API.get('/analytics/cashflow-calendar');
    return res.data;
  },

  getDayOfWeek: async () => {
    const res = await API.get('/analytics/day-of-week');
    return res.data;
  },

  getMerchantFrequency: async () => {
    const res = await API.get('/analytics/merchant-frequency');
    return res.data;
  },
};
