import API from './api';

export const assistantService = {
  ask: async (question) => {
    const res = await API.post('/assistant/ask', { question });
    return res.data;
  },
};
