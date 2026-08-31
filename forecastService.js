import API from './api';

export const forecastService = {
  getForecast: async (category = 'all') => {
    const res = await API.get(`/forecast/${encodeURIComponent(category)}`);
    return res.data;
  },
};
