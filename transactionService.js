import API from './api';

export const transactionService = {
  getTransactions: async (params = {}) => {
    const res = await API.get('/transactions', { params });
    return res.data;
  },

  addManual: async (transactionData) => {
    const res = await API.post('/transactions/manual', transactionData);
    return res.data;
  },

  importCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/transactions/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  importGpayHtml: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/transactions/import-gpay-html', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  importPdf: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await API.post('/transactions/import-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  importSms: async (sms_text) => {
    const res = await API.post('/transactions/import-sms', { sms_text });
    return res.data;
  },

  importSimulated: async (count = 5) => {
    const res = await API.post('/transactions/import-simulated', { count });
    return res.data;
  },

  deleteTransaction: async (id) => {
    const res = await API.delete(`/transactions/${id}`);
    return res.data;
  },
};
