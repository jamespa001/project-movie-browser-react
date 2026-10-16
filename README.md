![Movie Browser CI](https://github.com/jamespa001/project-movie-browser-react/actions/workflows/ci.yml/badge.svg)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://project-movie-browser-react.vercel.app/)

# 🎬 Movie Browser Web Application

[**🌐 View Live Platform**](https://project-movie-browser-react.vercel.app/) | [**🛠️ GitHub Repository**](https://github.com/jamespa001/project-movie-browser-react)

A responsive movie discovery and search application engineered with **React**, **Redux Toolkit**, **Tailwind CSS**, and the **OMDb API**.

---

## 🛠️ Engineering Highlights & Architecture

- **Problem & Context:** Public media APIs with strict rate limits require efficient asynchronous state management and loading safeguards to prevent flickering layout state shifts during rapid user input.
- **Key Technical Decisions:**
  - Integrated **Redux Toolkit** for predictable central state management across active search queries, modal states, and dynamic movie collection views.
  - Implemented client-side query debouncing and error boundary guards to handle missing poster assets and incomplete OMDb record payloads gracefully.
  - Designed zero-layout-shift skeleton loaders and responsive media grid layouts utilizing **Tailwind CSS**.
- **Results & Metrics:**
  - ⚡ Instant client-side state access and fluid modal overlays.
  - 🚀 Continuous integration workflow verification via **GitHub Actions**.
  - 📱 Fully responsive layout transitions optimized for mobile, tablet, and desktop viewports.

---

## ✨ Features

- **Dynamic Movie Search**: Real-time search query handling against the OMDb database with debounced input.
- **Detailed Modal Views**: Comprehensive movie details including ratings, cast info, genre breakdowns, and synopses.
- **Modern UI & Carousels**: Smooth, responsive grid and carousel layouts built with Tailwind CSS.
- **Automated CI/CD**: Integrated GitHub Actions pipeline for automated build validation and Vercel edge deployment.

---

## 🛠️ Tech Stack

- **Framework**: React, JavaScript (ES6+)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **API**: OMDb API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/jamespa001/project-movie-browser-react.git](https://github.com/jamespa001/project-movie-browser-react.git)
   cd project-movie-browser-react
   ```
