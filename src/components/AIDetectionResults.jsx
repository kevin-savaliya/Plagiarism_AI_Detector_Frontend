import React from 'react';
import './AIDetectionResults.css';

const AIDetectionResults = ({ results }) => {
  if (!results) return null;

  const {
    ai_probability,
    is_ai_generated,
    confidence,
    message,
    details,
    analysis
  } = results;

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 70) return '#ff4d4d';  // Red for high AI probability
    if (score >= 45) return '#ffa500';  // Orange for medium
    return '#2ecc71';  // Green for low AI probability
  };

  // Helper function to format percentage
  const formatPercentage = (value) => `${value}%`;

  return (
    <div className="ai-detection-results">
      {/* Main Result Section */}
      <div className="main-result" style={{ borderColor: getScoreColor(ai_probability) }}>
        <h2>Analysis Result</h2>
        <div className="probability-meter">
          <div 
            className="probability-fill" 
            style={{ 
              width: `${ai_probability}%`,
              backgroundColor: getScoreColor(ai_probability)
            }}
          />
          <span className="probability-text">
            {formatPercentage(ai_probability)} AI Probability
          </span>
        </div>
        <div className="result-message">{message}</div>
      </div>

      {/* Detailed Scores */}
      <div className="scores-grid">
        <div className="score-card">
          <h3>Pattern Analysis</h3>
          <div className="score-value" style={{ color: getScoreColor(details.pattern_score) }}>
            {formatPercentage(details.pattern_score)}
          </div>
          <p>Analysis of language patterns and formality</p>
        </div>
        <div className="score-card">
          <h3>Structure Analysis</h3>
          <div className="score-value" style={{ color: getScoreColor(details.structure_score) }}>
            {formatPercentage(details.structure_score)}
          </div>
          <p>Analysis of sentence structure and complexity</p>
        </div>
        <div className="score-card">
          <h3>Style Analysis</h3>
          <div className="score-value" style={{ color: getScoreColor(details.style_score) }}>
            {formatPercentage(details.style_score)}
          </div>
          <p>Analysis of writing style and vocabulary</p>
        </div>
      </div>

      {/* Text Statistics */}
      {analysis.text_statistics && (
        <div className="statistics-section">
          <h3>Text Statistics</h3>
          <div className="statistics-grid">
            <div className="stat-item">
              <label>Word Count</label>
              <span>{analysis.text_statistics.word_count}</span>
            </div>
            <div className="stat-item">
              <label>Sentence Count</label>
              <span>{analysis.text_statistics.sentence_count}</span>
            </div>
            <div className="stat-item">
              <label>Unique Words</label>
              <span>{analysis.text_statistics.unique_words}</span>
            </div>
            <div className="stat-item">
              <label>Vocabulary Diversity</label>
              <span>{analysis.text_statistics.vocabulary_diversity}</span>
            </div>
            <div className="stat-item">
              <label>Avg. Word Length</label>
              <span>{analysis.text_statistics.avg_word_length}</span>
            </div>
            <div className="stat-item">
              <label>Avg. Sentence Length</label>
              <span>{analysis.text_statistics.avg_sentence_length}</span>
            </div>
          </div>
        </div>
      )}

      {/* AI vs Human Indicators */}
      <div className="indicators-section">
        <div className="ai-indicators">
          <h3>AI Indicators</h3>
          <ul>
            <li>
              <span>Formal Language:</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${analysis.ai_indicators.formal_language}%`,
                    backgroundColor: getScoreColor(analysis.ai_indicators.formal_language)
                  }}
                />
              </div>
              <span>{formatPercentage(analysis.ai_indicators.formal_language)}</span>
            </li>
            <li>
              <span>Sentence Consistency:</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${analysis.ai_indicators.sentence_consistency}%`,
                    backgroundColor: getScoreColor(analysis.ai_indicators.sentence_consistency)
                  }}
                />
              </div>
              <span>{formatPercentage(analysis.ai_indicators.sentence_consistency)}</span>
            </li>
            <li>
              <span>Vocabulary Complexity:</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${analysis.ai_indicators.vocabulary_complexity}%`,
                    backgroundColor: getScoreColor(analysis.ai_indicators.vocabulary_complexity)
                  }}
                />
              </div>
              <span>{formatPercentage(analysis.ai_indicators.vocabulary_complexity)}</span>
            </li>
          </ul>
        </div>

        <div className="human-indicators">
          <h3>Human Indicators</h3>
          <ul>
            <li>
              <span>Personal Pronouns:</span>
              <strong>{analysis.human_indicators.personal_pronouns}</strong>
            </li>
            <li>
              <span>Informal Expressions:</span>
              <strong>{analysis.human_indicators.informal_expressions}</strong>
            </li>
            <li>
              <span>Natural Flow:</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${analysis.human_indicators.natural_flow}%`,
                    backgroundColor: '#2ecc71'
                  }}
                />
              </div>
              <span>{formatPercentage(analysis.human_indicators.natural_flow)}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Key Findings */}
      {analysis.key_findings && analysis.key_findings.length > 0 && (
        <div className="key-findings">
          <h3>Key Findings</h3>
          <ul>
            {analysis.key_findings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence Score */}
      <div className="confidence-score">
        <h3>Analysis Confidence</h3>
        <div className="confidence-meter">
          <div 
            className="confidence-fill" 
            style={{ width: `${confidence}%` }}
          />
          <span className="confidence-text">
            {formatPercentage(confidence)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIDetectionResults; 