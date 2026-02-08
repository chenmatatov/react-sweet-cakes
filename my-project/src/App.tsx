import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Sing_in from "./components/Sing_in/Sing_in";
import Home from "./components/Home/Home";
import './App.css';
import NavBar from "./components/NavBar/NavBar";
import Products from "./components/Products/Products";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Profile from "./components/Profile/Profile";
import AddProduct from "./components/AddProduct/AddProduct";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Sing_in />} />
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

