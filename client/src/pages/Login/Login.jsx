import React, { useState } from "react";
import "../../components/ReusableStyles.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ email: "", password: "", general: "" });

    // Validate email
    if (formData.email.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
    } else if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
    }

    // Validate password
    if (formData.password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));
    }

    // Check if there are any errors
    if (formData.email.trim() === "" || formData.password.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        "https://calorie-tracker-app-server.vercel.app/api/users/login",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Login successful. Token:", token);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error.message);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ ...errors, general: "Email or password doesn't match." });
      } else {
        setErrors({
          ...errors,
          general: "An error occurred. Please try again later.",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "0.8em" }}>{errors.email}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.password && (
            <p style={{ color: "red", fontSize: "0.8em" }}>{errors.password}</p>
          )}
        </div>
        {errors.general && (
          <p style={{ color: "red", fontSize: "0.8em" }}>{errors.general}</p>
        )}
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      <p>
        Don't have an account yet? <Link to="/signup">Sign Up </Link>
      </p>
    </div>
  );
};

export default Login;
