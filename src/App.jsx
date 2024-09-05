import "remixicon/fonts/remixicon.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./components/Admin/Product";
import NotFound from "./components/NotFound";
import Order from "./components/Admin/Order";
import Customers from "./components/Admin/Customers";
import Seetings from "./components/Admin/Seetings";
import Payment from "./components/Admin/Payment";
import Dashboard from "./components/Admin/Dashboard";
import Home from "./components/Home";
// import Products from "./components/Products";
import Category from "./components/Category";
import Contect from "./components/Contect";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "animate.css";
import PreGuard from "./components/Guard/PreGuard";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import AdminGuard from "./components/Guard/AdminGuard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home slider />} />
        <Route
          path="/product"
          element={<Home slider={false} title="All Products" />}
        />
        <Route path="/category" element={<Category />} />
        <Route path="/contect-us" element={<Contect />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
        <Route element={<PreGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<AdminGuard />}>
          <Route path="/admin">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Product />} />
            <Route path="orders" element={<Order />} />
            <Route path="customers" element={<Customers />} />
            <Route path="payments" element={<Payment />} />
            <Route path="settings" element={<Seetings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
