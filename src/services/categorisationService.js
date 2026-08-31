import API from './api';

export const categorisationService = {
  getLowConfidence: async () => {
    const res = await API.get('/categorisation/low-confidence');
    return res.data;
  },

  correctCategory: async (transaction_id, corrected_category) => {
    const res = await API.post('/categorisation/correct', {
      transaction_id,
      corrected_category,
    });
    return res.data;
  },

  getOverrides: async () => {
    const res = await API.get('/categorisation/overrides');
    return res.data;
  },

  getStats: async () => {
    const res = await API.get('/categorisation/stats');
    return res.data;
  },
};
