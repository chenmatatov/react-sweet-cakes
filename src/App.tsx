import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import './App.css';
import NavBar from "./pages/NavBar/NavBar";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Profile from "./pages/Profile/Profile";
import AddProduct from "./pages/AddProduct/AddProduct";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="home" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addproduct" element={<AddProduct />} />
      </Route>

    </Routes>
  );
}

export default App;

