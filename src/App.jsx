import React, { useState } from 'react';
import './App.css';
import AIDetectionResults from './components/AIDetectionResults';

function App() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Content Detection</h1>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <label htmlFor="text-input">Enter Text to Analyze *</label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              rows={6}
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !text.trim()}
          >
            {loading ? 'Analyzing...' : 'DETECT AI CONTENT'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Analyzing text...</p>
          </div>
        )}

        {results && !loading && (
          <AIDetectionResults results={results} />
        )}
      </main>
    </div>
  );
}

export default App; 