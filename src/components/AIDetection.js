import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

function AIDetection() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('https://plagiarism-ai-detector-backend.onrender.com/api/ai-detection', {
        text,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#ff4d4d';
    if (score >= 45) return '#ffa500';
    return '#4caf50';
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        AI Content Detection
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={8}
          label="Enter Text to Analyze"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Detect AI Content'}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          {/* Main Result */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: 3, 
              borderColor: getScoreColor(result.ai_probability) 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={result.ai_probability}
                  sx={{
                    height: 15,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor(result.ai_probability),
                    },
                  }}
                />
              </Box>
              <Typography variant="h6">
                {result.ai_probability.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {result.message}
            </Typography>
          </Paper>

          {/* Analysis Scores */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {result.details && Object.entries(result.details).map(([key, value]) => (
              <Grid item xs={12} md={4} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {key.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ color: getScoreColor(value) }}
                    >
                      {value.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Text Statistics */}
          {result.analysis?.text_statistics && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Text Statistics
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(result.analysis.text_statistics).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        {key.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* AI vs Human Indicators */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* AI Indicators */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  AI Indicators
                </Typography>
                <List>
                  {result.analysis?.ai_indicators && 
                    Object.entries(result.analysis.ai_indicators).map(([key, value]) => (
                      <ListItem key={key} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <ListItemText 
                          primary={key.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        />
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={value}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getScoreColor(value),
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {value.toFixed(1)}%
                        </Typography>
                      </ListItem>
                    ))
                  }
                </List>
              </Paper>
            </Grid>

            {/* Human Indicators */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Human Indicators
                </Typography>
                <List>
                  {result.analysis?.human_indicators &&
                    Object.entries(result.analysis.human_indicators).map(([key, value]) => (
                      <ListItem key={key}>
                        <ListItemText
                          primary={key.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                          secondary={
                            typeof value === 'number' && key !== 'natural_flow'
                              ? `Count: ${value}`
                              : `${value.toFixed(1)}%`
                          }
                        />
                        {key === 'natural_flow' && (
                          <Box sx={{ width: '50%', ml: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={value}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#4caf50',
                                },
                              }}
                            />
                          </Box>
                        )}
                      </ListItem>
                    ))
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Key Findings */}
          {result.analysis?.key_findings && result.analysis.key_findings.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Findings
              </Typography>
              <List>
                {result.analysis.key_findings.map((finding, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={finding} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Confidence Score */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Confidence
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={result.confidence}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#3498db',
                    },
                  }}
                />
              </Box>
              <Typography variant="h6">
                {result.confidence.toFixed(1)}%
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}

export default AIDetection; 