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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import FileUpload from '../components/FileUpload';
import axios from 'axios';

const AIDetection = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [textMetrics, setTextMetrics] = useState(null);

  // Minimum requirements for accurate AI detection
  const MIN_WORDS = 50;
  const MIN_CHARACTERS = 100;

  const analyzeTextMetrics = (text) => {
    if (!text) return null;

    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      uniqueWordCount: uniqueWords.size,
      avgWordLength: avgWordLength.toFixed(2),
      avgSentenceLength: avgSentenceLength.toFixed(2)
    };
  };

  const validateText = (text) => {
    if (!text) return { isValid: false, message: 'Please provide text to analyze' };
    
    const wordCount = text.trim().split(/\s+/).length;
    const charCount = text.trim().length;

    if (charCount < MIN_CHARACTERS) {
      return {
        isValid: false,
        message: `Text is too short. Please provide at least ${MIN_CHARACTERS} characters for accurate detection (current: ${charCount} characters)`
      };
    }

    if (wordCount < MIN_WORDS) {
      return {
        isValid: false,
        message: `Text is too short. Please provide at least ${MIN_WORDS} words for accurate detection (current: ${wordCount} words)`
      };
    }

    return { isValid: true };
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setFile(null);
    setTextMetrics(analyzeTextMetrics(newText));
    // Clear error when user starts typing
    setError(null);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setText('');
    setTextMetrics(null);
    // Clear error when new file is selected
    setError(null);
  };

  const analyzeContent = async () => {
    if (file) {
      // For files, we'll validate after reading the content on the backend
      setLoading(true);
      setError(null);
      setResults(null);
    } else {
      // For direct text input, validate before sending
      const validation = validateText(text);
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }
    }

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post('http://localhost:5000/api/detect-ai', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:5000/api/detect-ai', { text }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResults(response.data);
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err.response?.data?.error || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#ff4d4d';
    if (score >= 45) return '#ffa500';
    return '#4caf50';
  };

  const renderTextMetrics = () => {
    if (!textMetrics) return null;

    const metrics = [
      { label: 'Word Count', value: textMetrics.wordCount },
      { label: 'Sentence Count', value: textMetrics.sentenceCount },
      { label: 'Paragraph Count', value: textMetrics.paragraphCount },
      { label: 'Unique Words', value: textMetrics.uniqueWordCount },
      { label: 'Average Word Length', value: `${textMetrics.avgWordLength} characters` },
      { label: 'Average Sentence Length', value: `${textMetrics.avgSentenceLength} words` }
    ];

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Text Analysis
        </Typography>
        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  }
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontWeight: 'medium' }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const renderChart = () => {
    if (!results) return null;

    const pieData = [
      { name: 'AI Generated', value: results.ai_probability },
      { name: 'Human Written', value: 100 - results.ai_probability }
    ];

    return (
      <Paper sx={{ p: 3, mb: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom align="center">
          AI vs Human Probability
        </Typography>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                outerRadius={150}
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
                  left: 0,
                  right: 0,
                  paddingTop: 20,
                  paddingBottom: 20
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        AI Content Detection
      </Typography>
      
      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h6" gutterBottom>
          Upload a File or Enter Text
        </Typography>
        
        <FileUpload
          onFileSelect={handleFileSelect}
          label="Upload File"
          accept=".txt,.pdf,.docx,.doc,.csv,.xlsx"
        />
        
        <Typography variant="body1" style={{ margin: '20px 0' }}>
          OR
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label={`Enter Text (minimum ${MIN_WORDS} words or ${MIN_CHARACTERS} characters)`}
          value={text}
          onChange={handleTextChange}
          disabled={!!file}
          helperText={`For accurate AI detection, please provide at least ${MIN_WORDS} words of text`}
        />
        
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={analyzeContent}
            disabled={loading || (!text && !file)}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Paper style={{ padding: 20, marginBottom: 20, backgroundColor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          {/* Main Result */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: 3, 
              borderColor: getScoreColor(results.ai_probability) 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={results.ai_probability}
                  sx={{
                    height: 15,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(results.ai_probability),
                    },
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ minWidth: 60 }}>
                {results.ai_probability.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {results.message}
            </Typography>
          </Paper>

          {/* Chart */}
          {renderChart()}

          {/* Text Metrics */}
          {renderTextMetrics()}
        </Box>
      )}

      {/* Show text metrics before analysis only when there's text but no results */}
      {textMetrics && !results && renderTextMetrics()}
    </Box>
  );
};

export default AIDetection; 