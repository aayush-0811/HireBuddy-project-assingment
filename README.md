
---

## ✨ Features

### 🖥️ Frontend
- Responsive and modern UI inspired by **Jobright AI**
- Resume upload section
- Smart job role prediction based on resume content
- Automatic job search using predicted roles
- Job listings with clean cards showing:
  - Job title
  - Company
  - Location
  - Description
  - Apply button
- Search bar with query tracking

### 🔧 Backend
- Built using **Node.js + Express**
- Resume parsing with `pdf-parse`
- Job role prediction using **Hugging Face Zero-Shot Classifier**
- Full-text search and filtering
- MongoDB used for storing:
  - Job listings (loaded from `.jsonl`)
  - User search keywords with count
- Clean API endpoints for job fetch, search, and resume upload

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- pdf-parse
- multer (for file upload)
- Hugging Face Transformers (Zero-Shot Classification)

---

## 🚀 How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/aayush-0811/HireBuddy-project-assingment.git
cd HireBuddy-project-assingment
