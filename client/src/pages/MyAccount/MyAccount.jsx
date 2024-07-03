import React, { useState, useEffect } from "react";
import Layout from "../SideBar/Layout";
import ChangeCredentials from "../../components/ChangeCredentials/ChangeCredentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import "./MyAccount.css";

const MyAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activityType: "no activity",
    goals: "maintain",
    dailyCalorieGoal: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    dailyCalorieGoal: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate height, weight, and age fields
    if (
      !formData.height.trim() ||
      !formData.weight.trim() ||
      !formData.age.trim()
    ) {
      const newErrors = { ...errors };

      if (!formData.height.trim()) {
        newErrors.height = "Height is required.";
      } else {
        newErrors.height = "";
      }

      if (!formData.weight.trim()) {
        newErrors.weight = "Weight is required.";
      } else {
        newErrors.weight = "";
      }

      if (!formData.age.trim()) {
        newErrors.age = "Age is required.";
      } else {
        newErrors.age = "";
      }

      setErrors({ ...newErrors, dailyCalorieGoal: "" });
      return;
    }

    setErrors({ ...errors, height: "", weight: "", age: "" });
    try {
      const userId = getUserIdFromToken();
      const dailyCalorieGoal = calculateDailyCalorieGoal(formData);
      localStorage.setItem("dailyCalorieGoal", dailyCalorieGoal);
      const updatedFormData = { ...formData, dailyCalorieGoal };
      setFormData(updatedFormData);
      const response = await axios.put(
        `https://calorie-tracker-app-server.vercel.app/api/infos/${userId}`,
        updatedFormData
      );
      console.log("Updated user info:", response.data);
    } catch (error) {
      console.error("Error updating user info:", error);
    }

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

    // Validate numeric fields
    const numericFields = ["height", "weight", "age"];
    numericFields.forEach((field) => {
      if (isNaN(formData[field])) {
        newErrors[field] = "Please enter a valid number.";
        formIsValid = false;
      } else {
        newErrors[field] = "";
      }
    });

    setErrors(newErrors);

    // Calculate daily calorie goal if all fields are valid
    if (formIsValid) {
      const dailyCalorieGoal = calculateDailyCalorieGoal(formData);
      setFormData({ ...formData, dailyCalorieGoal });
    }
  };

  const calculateDailyCalorieGoal = (formData) => {
    const { weight, height, age, gender, activityType, goals } = formData;
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    let activityFactor;
    switch (activityType) {
      case "no activity":
        activityFactor = 1.2;
        break;
      case "low activity":
        activityFactor = 1.375;
        break;
      case "medium activity":
        activityFactor = 1.55;
        break;
      case "high activity":
        activityFactor = 1.725;
        break;
      case "very high activity":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const tdee = bmr * activityFactor;
    let dailyCalorieGoal;
    switch (goals) {
      case "lose":
        dailyCalorieGoal = tdee * 0.8;
        break;
      case "maintain":
        dailyCalorieGoal = tdee;
        break;
      case "gain":
        dailyCalorieGoal = tdee * 1.2;
        break;
      default:
        dailyCalorieGoal = tdee;
    }

    return Math.round(dailyCalorieGoal);
  };

  return (
    <Layout>
      <div className="Container">
        <ChangeCredentials />
        <h3 className="Header">My Account</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="height">Height (cm):</label>
            <br />
            <input
              type="text"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
            {errors.height && (
              <p style={{ color: "red", fontSize: "0.8em" }}>{errors.height}</p>
            )}
          </div>
          <div>
            <label htmlFor="weight">Weight (kg):</label>
            <br />
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            {errors.weight && (
              <p style={{ color: "red", fontSize: "0.8em" }}>{errors.weight}</p>
            )}
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <br />
            <input
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            {errors.age && (
              <p style={{ color: "red", fontSize: "0.8em" }}>{errors.age}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <br />
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="activityType">Activity Type:</label>
            <br />
            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
            >
              <option value="no activity">No Activity</option>
              <option value="low activity">Low Activity</option>
              <option value="medium activity">Medium Activity</option>
              <option value="high activity">High Activity</option>
              <option value="very high activity">Very High Activity</option>
            </select>
          </div>
          <div>
            <label htmlFor="goals">Goals:</label>
            <br />
            <select
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
            >
              <option value="lose">Lose</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain</option>
            </select>
          </div>
          {errors.dailyCalorieGoal && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              {errors.dailyCalorieGoal}
            </p>
          )}
          <div>
            <label htmlFor="dailyCalorieGoal">Daily Calorie Goal:</label>
            <br />
            <input
              type="text"
              id="dailyCalorieGoal"
              name="dailyCalorieGoal"
              value={formData.dailyCalorieGoal}
              readOnly
            />
          </div>
          <div>
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default MyAccount;
