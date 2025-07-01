import axios from 'axios';

const API_URL = 'https://plagiarism-ai-detector-backend.onrender.com/api';

const api = {
  analyzeSimilarity: async (text1, text2) => {
    const response = await axios.post(`${API_URL}/analyze-similarity`, {
      text1,
      text2,
    });
    return response.data;
  },

  detectAI: async (text) => {
    const response = await axios.post(`${API_URL}/detect-ai`, {
      text,
    });
    return response.data;
  },

  getReports: async () => {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  },
};

export default api; 