# 📚 Plagiarism & AI Detection System

An intelligent web-based platform to detect **AI-generated content** and check **text similarity (plagiarism)** between two texts using advanced NLP and ML algorithms.

This project includes a **React.js frontend**, **Flask backend**, and integrates multiple models and statistical techniques for robust analysis.

> 🌐 **Live Frontend**: [Plagiarism & AI Detection (Frontend)](https://plagiarism-ai-detector-frontend.vercel.app)
> 🔗 **Backend API**: [Render Hosted API](https://plagiarism-ai-detector-backend.onrender.com)

---

## 📌 Features

### 🤖 AI Detection

* Upload files: `.txt`, `.pdf`, `.docx`, `.csv`, `.xlsx`, etc., or directly input text.
* Detects AI-generated content using fine-tuned Transformer models (e.g. GPT-2, Roberta).
* Displays:

  * **Pie chart** showing AI vs Human content proportion.
  * **Confidence-based status:**

    * <30% → Likely human-written
    * 30-70% → Uncertain (could be either human or AI)
    * >70% → Likely AI-generated
    * Confidence <50% → Low confidence in analysis.
* Text analysis summary:

  * Word Count, Sentence Count, Paragraph Count
  * Unique Words
  * Average Word Length
  * Average Sentence Length

### 📖 Plagiarism (Similarity) Detection

* Compares two texts and calculates **four similarity metrics**:

  * **Jaccard Similarity**: Measures intersection over union of word sets.
  * **Cosine Similarity**: Measures the cosine angle between two text vectors.
  * **TF-IDF Similarity**: Uses term frequency-inverse document frequency vector comparison.
  * **Average Similarity**: Mean of Cosine, Jaccard, and TF-IDF scores.
* Displays results in **bar charts** for intuitive understanding.

---

## 🛠️ Technologies Used

| Layer              | Technology / Library                               |
| ------------------ | -------------------------------------------------- |
| Frontend           | React.js, Axios, Material-UI, Chart.js             |
| Backend            | Flask, Flask-RESTful, Python                       |
| ML/NLP             | Transformers (GPT-2, Roberta), SpaCy, Scikit-learn |
| Data               | pandas, numpy, PyPDF2 (PDF parsing)                |
| Visualization      | Chart.js, matplotlib, seaborn                      |
| Hosting (Frontend) | Vercel                                             |
| Hosting (Backend)  | Render                                             |

---

## 🧠 How It Works

### 🔍 AI Detection Flow

1. **Text/File Input** → Preprocessing (tokenization, cleaning).
2. **Feature Extraction**: sentence length, repetition, complexity.
3. **AI Model Evaluation** using fine-tuned transformers.
4. **Confidence Score Calculation**.
5. **Output**:

   * Probability of AI-generated content.
   * Pie chart visualization.
   * Text analysis summary and status.

### 📝 Similarity Detection Flow

1. **Text-to-Text Comparison**:

   * Preprocessing → Vectorization (TF-IDF) → Similarity calculations.
2. **Output**:

   * Bar chart displaying all four similarity metrics.
   * Detailed plagiarism report.

---

## ▶️ Getting Started

### 🔧 Prerequisites

* **Frontend**:

  * Node.js (v14+)
* **Backend**:

  * Python 3.10
  * pip

---

## 🔽 Clone the Repositories

### Frontend

```bash
git clone https://github.com/kevin-savaliya/Plagiarism_AI_Detector_Frontend.git
cd Plagiarism_AI_Detector_Frontend
```

### Backend

```bash
git clone https://github.com/kevin-savaliya/Plagiarism_AI_Detector_Backend.git
cd Plagiarism_AI_Detector_Backend
```

---

## ▶️ Running the Project

### 🚀 Start Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows use venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app/main.py
```

### 🚀 Start Frontend

```bash
cd Plagiarism_AI_Detector_Frontend
npm install

# Create .env file with:
# REACT_APP_API_URL=https://plagiarism-ai-detector-backend.onrender.com

npm start
```

---

## 🛠 Environment Variables

### Frontend `.env`

```env
REACT_APP_API_URL=https://plagiarism-ai-detector-backend.onrender.com
```

### Backend `.env`

(Optional, if you use any secrets or API keys)

---

## 🔮 Future Improvements

* 📝 **Database integration** for user history and analytics.
* 🧠 **Enhanced AI detection** with multiple classification models.
* 📄 **Export plagiarism/AI reports** as PDF.
* 🗂️ **Bulk file uploads** with queued analysis.
* 🔐 **User authentication and dashboards**.

---

## 👨‍💻 Author

**Kevin Savaliya**

* GitHub: [@kevin-savaliya](https://github.com/kevin-savaliya)
* Frontend: [Plagiarism & AI Detector (Vercel)](https://plagiarism-ai-detector-frontend.vercel.app)
* Backend API: [Render Hosted API](https://plagiarism-ai-detector-backend.onrender.com)

---

> ⭐️ **If you found this project helpful, please star the repository to support my work!**


