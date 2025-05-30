# 🚀 HireBuddy - Smart Job Board Web App

A fully responsive, AI-powered job board web application that helps users upload resumes, predict the most suitable job roles, and view tailored job listings. Built as part of a technical assignment, this project demonstrates complete full-stack development without using any AI-assisted coding tools.

[![Live Site](https://img.shields.io/badge/Live%20Site-HireBuddy-green?style=for-the-badge)](https://hire-buddy-project-assingment.vercel.app/)

---

## 🔍 Live Project

🌐 **Deployed Site**: [https://hire-buddy-project-assingment.vercel.app/](https://hire-buddy-project-assingment.vercel.app/)

---

## 📸 Screenshots

### 🔍 Home Page
![Homepage Screenshot](https://github.com/aayush-0811/HireBuddy-project-assingment/assets/homepage-sample.png)

### 📄 Resume Upload + Predicted Job Matches
![Predicted Jobs Screenshot](https://github.com/aayush-0811/HireBuddy-project-assingment/assets/job-matching-sample.png)

> *(You can replace the image URLs with actual uploaded screenshots in your GitHub repo’s "assets" folder)*

---

## ⚙️ Features

### Frontend
- ⚡ Built with React + Tailwind CSS
- 📄 Resume upload with real-time job role prediction
- 🔎 Search bar with tracked keywords
- 📋 Beautifully structured job cards with:
  - Title
  - Company
  - Location
  - Description
  - “Apply Now” button
- 📱 Fully responsive design

### Backend
- 🚀 Node.js + Express.js server
- 🧠 AI-based job role prediction using Hugging Face (zero-shot classifier)
- 🧾 Resume parsing with `pdf-parse`
- 🗃️ Job listings stored in MongoDB (loaded from `.jsonl`)
- 🔍 Full-text job search and filtering
- 📊 Tracks search keywords and their usage

---

## 🧠 AI Integration

- Uses [Hugging Face Zero-Shot Classification](https://huggingface.co/models/facebook/bart-large-mnli) to predict job roles based on the resume text.

---

## 🧰 Tech Stack

| Frontend | Backend | AI & Tools | Database |
|----------|---------|------------|----------|
| React.js (Vite) | Node.js + Express | Hugging Face Transformers | MongoDB |
| Tailwind CSS | multer, pdf-parse | Zero-Shot Classifier | Mongoose |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/aayush-0811/HireBuddy-project-assingment.git
cd HireBuddy-project-assingment
