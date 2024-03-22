import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SideBar.css";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const SideBar = ({ isOpen, onCloseSidebar }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userId = getUserIdFromToken();
          const response = await axios.get(
            `http://localhost:5000/api/users/${userId}`
          );
          const userData = response.data;
          setUsername(userData.username);
        } else {
          console.log("No token found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    } else {
      console.error("Token not found in local storage");
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`} onClick={handleClick}>
      <div className="sidebar-header">Calorie-Tracker App</div>
      <div className="user-greeting">Hello, {username}.</div>
      <div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/mealhistory">Meal History</Link>
        </li>
        <li>
          <Link to="/myaccount">My Account</Link>
        </li>
      </ul>
      <button className="sidebar-close-button" onClick={onCloseSidebar}>
        X
      </button>
      <div className="sidebar-footer"></div>
    </div>
  );
};

export default SideBar;
