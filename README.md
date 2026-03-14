# 💸 ExpenseAI - Smart MERN Expense Tracker

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

ExpenseAI is a full-stack personal finance application built with the **MERN** stack. It leverages **Hugging Face AI** to automatically categorize your transactions, helping you track budgets, analyze spending habits, and manage your finances intelligently without the hassle of manual data entry.

---

## ✨ Core Features

### 🧠 AI-Powered Categorization
* **Zero-Shot Classification:** Uses Hugging Face's `facebook/bart-large-mnli` model to automatically read expense titles (e.g., "Uber Ride", "Monthly Electricity Bill") and assign them to the correct category.
* **Smart Caching:** Saves AI classifications to a MongoDB cache. If the same expense title is entered again, it pulls from the database instantly, saving API limits and drastically speeding up the app.

### 📊 Interactive Dashboard & KPIs
* **Visual Insights:** View total spending, average transaction costs, and category-specific breakdowns (like Total Housing & Utilities).
* **Budget Limits:** Set monthly limits for specific categories (e.g., "Food & Dining" or "Transportation"). The dashboard generates real-time, color-coded progress bars to warn you when you are nearing or exceeding your limits.

### 📁 Advanced Data Management
* **Bulk CSV Import:** Upload bank statements or expense reports via `.csv` files. The app parses the file and saves dozens of transactions to the database in seconds.
* **Secure Authentication:** Complete User Registration and Login system using encrypted passwords (Bcrypt) and secure JSON Web Tokens (JWT).

---

## 🛠️ Technology Stack

**Frontend:**
* React.js (Component-based UI)
* Tailwind CSS (Styling and responsive design)
* Axios (HTTP client for API requests)

**Backend:**
* Node.js (Runtime environment)
* Express.js (REST API framework)
* MongoDB & Mongoose (NoSQL Database & ODM)
* JSON Web Tokens (JWT) & Bcrypt (Security & Auth)
* Node `fetch` (Communicating with Hugging Face API)

---

## 🚀 Installation & Setup

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)
* A free [Hugging Face](https://huggingface.co/) account and API key.

### 2. Clone the Repository
```bash
git clone [https://github.com/your-username/expense-tracker-project.git](https://github.com/your-username/expense-tracker-project.git)
cd expense-tracker-project