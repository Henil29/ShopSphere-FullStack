# 🛒 ShopSphere – MERN Stack E-Commerce App

**ShopSphere** is a full-stack e-commerce application built with the **MERN stack**, replicating the core functionalities of Amazon like user authentication, product listings, cart management, and order processing.

---

## 🚀 Features

### 🧑 User Features
- 🔐 User Registration & Login (JWT Authentication)
- 👤 Profile management
- 🛒 Add to cart / Remove from cart
- 📦 Place orders and view order history

### 📦 Product Features
- 🛍️ Browse products by category
- 🔍 Search and filter products
- ✨ View product details

### 🔧 Admin Features (optional)
- ➕ Add/Edit/Delete products
- 📊 Manage users and orders

---

## 🛠 Tech Stack

| Category       | Technologies                          |
|----------------|---------------------------------------|
| **Frontend**   | React.js, Axios, React Router         |
| **Backend**    | Node.js, Express.js                   |
| **Database**   | MongoDB, Mongoose                     |
| **Security**   | JWT, bcrypt.js                        |
| **Deployment** | Render / Vercel / Railway             |

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- MongoDB v5+
- npm or yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/Henil29/ShopSphere.git
cd ShopSphere
```

---

### 2. 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` folder:

```env
PORT=8080
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
DB_NAME=amazon
CLOUDINARY_API_KEY = your_cloudinary_key
CLOUDINARY_API_SECRET = your_cloudinary_secret
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
```

Start the backend:

```bash
node app.js
```

---

### 3. 💻 Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧠 Upcoming Features

- 🖼️ Product image gallery  
- 📦 Order tracking system  
- 💳 Payment gateway integration  
- 🌙 Dark mode  
- ✉️ Email notifications (e.g., order confirmation)  
- 📱 Responsive mobile-friendly design  

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first  
to discuss what you would like to change.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Developed with 💛 by **Henil Patel**
