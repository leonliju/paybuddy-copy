import API from './api';

export const budgetGoalService = {
  getBudgetStatus: async () => {
    const res = await API.get('/budget/status');
    return res.data;
  },

  setBudget: async (budgetData) => {
    const res = await API.post('/budget/set', budgetData);
    return res.data;
  },

  getSavingsGoals: async () => {
    const res = await API.get('/savings/goals');
    return res.data;
  },

  createSavingsGoal: async (goalData) => {
    const res = await API.post('/savings/goals', goalData);
    return res.data;
  },

  deleteSavingsGoal: async (goalId) => {
    const res = await API.delete(`/savings/goals/${goalId}`);
    return res.data;
  },

  getFeasibility: async (goalId) => {
    const res = await API.get(`/savings/feasibility/${goalId}`);
    return res.data;
  },

  getDeadMoney: async () => {
    const res = await API.get('/deadmoney/detect');
    return res.data;
  },
};
