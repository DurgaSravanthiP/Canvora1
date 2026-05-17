# Canvora 🎨✨

**Handcrafted Excellence**

Canvora is a full-stack e-commerce marketplace dedicated to showcasing and trading handcrafted arts and products. It serves as a dynamic bridge between artisans and buyers, providing a platform tailored specifically for the trading of artisanal goods.

Artists can create profiles, list their handmade products, and manage inventory. Buyers can browse items, curate wishlists, and utilize a unique request system to propose custom price offers for artworks, facilitating direct and interactive negotiation.

---

## 🚀 Key Features

* **Dual User Roles**: Seamlessly switch between finding beautiful art as a Buyer or showcasing your talent as an Artist.
* **Product Management**: Artists can list products with details including pricing, images, category, and edition copies.
* **Smart Request System**: Buyers can make direct "Requests" for products by proposing custom price offers. Artists can choose to accept, reject, or keep the offers pending.
* **Curated Wishlists**: Users can save their favorite handcrafted products to their personal wishlists for future purchases.
* **Smooth UI/UX**: Built with Framer Motion and Tailwind CSS, the platform features a responsive, modern, and animated user interface.

---

## 🛠️ Tech Stack

### Frontend
* **React** (via Vite)
* **Tailwind CSS** (for styling)
* **Framer Motion** (for smooth animations)
* **React Router Dom** (for navigation)
* **Axios** (for API requests)

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database and ODM)
* **JSON Web Tokens (JWT)** (Secure authentication)
* **Bcrypt.js** (Password hashing)
* **Multer** (File/Image uploads)

---

## 🔧 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Canvora
```

### 2. Backend Setup
Navigate to the backend directory and set up the server:

```bash
cd backend

# Install backend dependencies
npm install

# Create a .env file in the backend directory
# Example .env configuration:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start the backend development server
npm run dev
```
The server will typically run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and set up the client app:

```bash
cd frontend

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🗂️ Project Structure

```
Canvora/
├── backend/               # Express.js REST API
│   ├── controllers/       # Route logic
│   ├── middleware/        # Authentication and error handling
│   ├── models/            # Mongoose Schemas (User, Product, Request, Profile, Wishlist)
│   ├── routes/            # API endpoints mapping
│   ├── uploads/           # Local storage for image uploads
│   └── index.js           # Server entry point
│
└── frontend/              # React Vite Application
    ├── public/            # Static assets
    ├── src/               # React components, pages, and logic
    ├── package.json       # Frontend dependencies
    ├── tailwind.config.js # Tailwind styles configuration
    └── vite.config.js     # Vite bundler configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the **ISC License**.
