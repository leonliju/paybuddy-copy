import API from './api';

export const healthService = {
  getScore: async () => {
    const res = await API.get('/health/score');
    return res.data;
  },
};
