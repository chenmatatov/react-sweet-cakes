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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Sing_in />} />
      <Route path="home" element={
        <ProtectedRoute>
          <NavBar />
        </ProtectedRoute>
      }>
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="products/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="addproduct" element={
          <ProtectedRoute requireAdmin={true}>
            <AddProduct />
          </ProtectedRoute>
        } />
      </Route>

    </Routes>
  );
}

export default App;

