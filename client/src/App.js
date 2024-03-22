import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import MealHistory from "./pages/MealHistory/MealHistory";
import MyAccount from "./pages/MyAccount/MyAccount";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mealhistory" element={<MealHistory />} />
          <Route path="/Myaccount" element={<MyAccount />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;