# 🌳 node-tree-app

A full-stack recursive **Tree Management Application** with infinite nesting, built using **React (Vite + TypeScript + ShadCN)** for the frontend and **Node.js (Express + TypeScript + MongoDB)** for the backend.  

This project demonstrates scalable architecture, clean code practices (Repository Pattern), and a smooth user experience with lazy loading, pagination, and CRUD operations on tree nodes.

---

## ✨ Features
- 🔐 **Backend**
  - Built with **Node.js + Express + TypeScript**
  - Repository-Service-Controller architecture
  - MongoDB (Mongoose) data persistence
  - Recursive tree structure with **infinite nesting**
  - Pagination for both root and child nodes
  - CRUD operations (Create, Read, Update, Delete)

- 🎨 **Frontend**
  - Built with **React + Vite + TypeScript**
  - Styled with **ShadCN/UI**
  - Recursive tree view with **expand/collapse**
  - Lazy loading children nodes (fetch on expand)
  - Add, edit, and delete nodes via dialogs
  - Pagination for root nodes & children
  - State management with **Redux Toolkit**

- ⚙️ **DevOps**
  - Environment-based configuration
  - CORS handled with frontend URL from `.env`
  - Ready for deployment on **Render (backend)** & **Vercel (frontend)**

---

## 🗂 Project Structure

```bash
node-tree-app/
├── README.md
├── LICENSE
├── backend/ # Express + TS + MongoDB backend
│ ├── package.json
│ ├── tsconfig.json
│ └── src/
│ ├── app.ts
│ ├── config/ # db connection, env variables
│ ├── controllers/ # NodeController + interfaces
│ ├── models/ # Mongoose schema
│ ├── repositories/# Repository layer + interfaces
│ ├── routes/ # Express routes
│ └── services/ # Business logic + interfaces
└── frontend/ # React + Vite + TS frontend
├── package.json
├── vite.config.ts
└── src/
├── api/ # Axios API layer
├── components/ # UI components + dialogs
├── hooks/ # Custom hooks
├── lib/ # Utils
├── pages/ # Page components
└── store/ # Redux store + slices
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/sahshad-node-tree-app.git
cd sahshad-node-tree-app
```
### 2. Backend Setup
```bash
cd backend
npm install
```
#### Create a .env file in backend/:
```bash
MONGO_URI=your-mongodb-uri
CLIENT_URL=http://localhost:5173
PORT=5000
```

#### Run locally:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Create a .env file in frontend/:
```bash
VITE_API_URL=http://localhost:5000
```

#### Run locally:
```bash
npm run dev
```

## 📌 API Endpoints

- **POST** `/nodes`  
  → Create a node

- **GET** `/nodes/roots?page=1&limit=5`  
  → Get root nodes (paginated)

- **GET** `/nodes/:id/children?page=1&limit=5`  
  → Get child nodes (paginated)

- **PATCH** `/nodes/:id`  
  → Update node

- **DELETE** `/nodes/:id`  
  → Delete node (and its children)

## 🛠 Tech Stack

- **Frontend:** React, Vite, TypeScript, ShadCN/UI, Redux Toolkit, Axios  
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose  
- **Dev Tools:** ESLint, Prettier, Vercel, Render

## 📄 License

This project is licensed under the [MIT License](LICENSE).