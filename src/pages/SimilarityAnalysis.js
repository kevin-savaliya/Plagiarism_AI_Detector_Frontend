import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../services/api';

const SimilarityAnalysis = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text1 || !text2) {
      setError('Please enter both texts to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.analyzeSimilarity(text1, text2);
      setResults(response);
    } catch (err) {
      setError('Error analyzing texts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#00C49F';
    if (score >= 60) return '#FFBB28';
    return '#FF8042';
  };

  const renderCharts = () => {
    if (!results) return null;

    const chartData = [
      { name: 'TF-IDF', value: results.tfidf_similarity * 100 },
      { name: 'Jaccard', value: results.jaccard_similarity * 100 },
      { name: 'Cosine', value: results.cosine_similarity * 100 },
      { name: 'Average', value: results.average_similarity * 100 },
    ];

    const pieData = [
      { name: 'Similar', value: results.average_similarity * 100 },
      { name: 'Different', value: 100 - (results.average_similarity * 100) }
    ];

    return (
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom align="center">
              Similarity Metrics Comparison
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => value.toFixed(2) + '%'} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    paddingTop: "10px",
                    marginBottom: "-10px"
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Similarity Score"
                  fill="#8884d8"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom align="center">
              Overall Similarity
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  innerRadius={0}
                  paddingAngle={0}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#0088FE' : '#00C49F'} 
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  wrapperStyle={{
                    bottom: 0,
                    lineHeight: '24px'
                  }}
                />
                <Tooltip 
                  formatter={(value) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Results */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Analysis Results
            </Typography>
            <Grid container spacing={3}>
              {chartData.map((metric, index) => (
                <Grid item xs={12} sm={6} md={3} key={metric.name}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      border: 1,
                      borderColor: COLORS[index],
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {metric.name} Similarity
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: getScoreColor(metric.value) }}
                    >
                      {metric.value.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {metric.name === 'TF-IDF' && 'Based on word frequency and importance'}
                      {metric.name === 'Jaccard' && 'Based on word overlap between texts'}
                      {metric.name === 'Cosine' && 'Based on vector similarity'}
                      {metric.name === 'Average' && 'Overall similarity score'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Text Similarity Analysis
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Enter two texts to analyze their similarity using multiple metrics.
      </Typography>

      <form onSubmit={handleAnalyze}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="First Text"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Second Text"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem' 
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Similarity'}
          </Button>
        </Box>
      </form>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          {renderCharts()}
        </Box>
      )}
    </Box>
  );
};

export default SimilarityAnalysis; 