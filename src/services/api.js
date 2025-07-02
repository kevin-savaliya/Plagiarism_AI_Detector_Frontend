import axios from 'axios';

const API_URL = process.env.API_URL || 'https://plagiarism-ai-detector-backend.onrender.com/api';

// Configure Axios with default timeout and base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 45000, // 45 seconds to accommodate Render cold start
  headers: { 'Content-Type': 'application/json' },
});

const api = {
  analyzeSimilarity: async (text1, text2) => {
    try {
      const response = await withRetry(() => axiosInstance.post('/analyze-similarity', { text1, text2 }));
      return response.data;
    } catch (error) {
      console.error('Similarity analysis error:', error.message);
      throw error;
    }
  },

  detectAI: async (text) => {
    try {
      const response = await withRetry(() => axiosInstance.post('/detect-ai', { text }));
      return response.data;
    } catch (error) {
      console.error('AI detection error:', error.message);
      throw error;
    }
  },

  getReports: async () => {
    try {
      const response = await withRetry(() => axiosInstance.get('/reports'));
      return response.data;
    } catch (error) {
      console.error('Get reports error:', error.message);
      throw error;
    }
  },
};

// Retry logic for handling Render cold starts
const withRetry = async (fn, maxAttempts = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fn();
      return response;
    } catch (error) {
      if (attempt === maxAttempts || !error.code === 'ECONNABORTED' && !error.response) {
        throw error;
      }
      console.log(`Retry ${attempt}/${maxAttempts} due to error: ${error.message}, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default api;