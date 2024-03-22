import React, { useEffect } from "react";
import "./Home.css";
import ProgressCard from "../../components/ProgressCard/ProgressCard";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Layout from "../SideBar/Layout";
import { useNavigate } from "react-router";

const Home = () => {
  const dailyCalorieGoal = localStorage.getItem("dailyCalorieGoal");
  const totalCaloriesConsumed = localStorage.getItem("totalCaloriesConsumed");
  const totalProteinsConsumed = localStorage.getItem("totalProteinsConsumed");
  const totalCarbohydratesConsumed = localStorage.getItem(
    "totalCarbohydratesConsumed"
  );
  const totalFatsConsumed = localStorage.getItem("totalFatsConsumed");

  const formattedValueGoal = dailyCalorieGoal
    ? `${dailyCalorieGoal} `
    : "Goal not set";
  const formattedValueConsumed = totalCaloriesConsumed
    ? `${totalCaloriesConsumed} `
    : "0 calories";
  const caloriesToGo = dailyCalorieGoal - (totalCaloriesConsumed || 0);
  const formattedCaloriesToGo =
    caloriesToGo >= 0
      ? `${caloriesToGo} calories`
      : `-${Math.abs(caloriesToGo)} calories`;
  const numericValueGoal = parseInt(formattedValueGoal);
  const maxValueForProteins = Math.round(numericValueGoal * 0.2);
  const maxValueForCarbohydrates = Math.round(numericValueGoal * 0.5);
  const maxValueForFats = Math.round(numericValueGoal * 0.3);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="Container">
        <div className="Header">
          <h2>Daily Progress</h2>
        </div>
        <div className="progress">
          <ProgressCard title="Daily Goal" value={formattedValueGoal} />
          <ProgressCard
            title="Calories Consumed"
            value={formattedValueConsumed}
          />
          <ProgressCard title="Calories To Go" value={formattedCaloriesToGo} />
        </div>
        <div className="row-container">
          <div className="component-container">
            <div>
              <ProgressBar
                label="Calories"
                value={totalCaloriesConsumed}
                maxValue={formattedValueGoal}
                color="red"
              />
              <ProgressBar
                label="Proteins"
                value={totalProteinsConsumed}
                maxValue={maxValueForProteins}
                color="green"
              />
              <ProgressBar
                label="Carbohydrates"
                value={totalCarbohydratesConsumed}
                maxValue={maxValueForCarbohydrates}
                color="blue"
              />
              <ProgressBar
                label="Fats"
                value={totalFatsConsumed}
                maxValue={maxValueForFats}
                color="yellow"
              />
            </div>
          </div>
          <div className="component-container"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
