import React, { useState } from "react";
import axios from "axios";
import "../../components/ReusableStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState();
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { username: "", email: "", password: "" };

    // Validate username
    if (formData.username.trim() === "") {
      newErrors.username = "Username is required.";
      formIsValid = false;
    }

    // Validate email
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required.";
      formIsValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    // Validate password
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      axios
        .post("https://calorie-tracker-app-server.vercel.app/api/users/", formData)
        .then((response) => {
          console.log("User created successfully:", response.data);
          setSuccessMessage("User created successfully");
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="container">
      <h2 className="title">Sign Up Form</h2>
      {successMessage && (
        <p style={{ color: "green", fontSize: "0.8em" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p style={{ color: "red", fontSize: "0.8em" }}>{errors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
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
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <div className="password-input">
            {" "}
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
        <div>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
