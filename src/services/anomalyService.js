import API from './api';

export const anomalyService = {
  detectAnomalies: async () => {
    const res = await API.get('/anomaly/detect');
    return res.data;
  },

  getFlags: async () => {
    const res = await API.get('/anomaly/flags');
    return res.data;
  },
};
