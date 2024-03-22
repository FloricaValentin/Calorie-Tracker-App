import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./ChangeCredentials.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangeCredentials = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { ...errors };

    // Validate each field
    if (formData.username.trim() === "") {
      newErrors.username = "Username is required.";
      formIsValid = false;
    } else {
      newErrors.username = "";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
      formIsValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);

    if (formIsValid) {
      updateCredentials(formData);
    }
  };

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

  const updateCredentials = async (formData) => {
    try {
      const userId = getUserIdFromToken();
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update credentials");
      }

      console.log("Credentials updated successfully");
    } catch (error) {
      console.error("Error updating credentials:", error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <h3>Change Credentials</h3>
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
          <label htmlFor="password">Password:</label>
          <br />
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
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default ChangeCredentials;
