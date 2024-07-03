import React, { useState, useEffect } from "react";
import Layout from "../SideBar/Layout";
import axios from "axios";
import "./MealHistory.css";
import { useNavigate } from "react-router";

const MealHistory = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [foodData, setFoodData] = useState({
    name: "",
    servingSize: "",
    calories: "",
    proteins: "",
    carbohydrates: "",
    fats: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedFoods, setAddedFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    servingSize: "",
    calories: "",
    proteins: "",
    carbohydrates: "",
    fats: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [foodsPerPage] = useState(5);

  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [searchResultsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllFoods();
    const storedFoods = localStorage.getItem("addedFoods");
    if (storedFoods) {
      setAddedFoods(JSON.parse(storedFoods));
    }
  }, []);

  const saveAddedFoodsToLocalStorage = (foods) => {
    localStorage.setItem("addedFoods", JSON.stringify(foods));
  };

  const fetchAllFoods = async () => {
    try {
      const response = await axios.get("https://calorie-tracker-app-server.vercel.app/api/foods/");
      setAllFoods(response.data.data.foods);
    } catch (error) {
      console.error("Error fetching all foods:", error);
    }
  };

  const handleInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const results = allFoods.filter((food) =>
      food.name.toLowerCase().startsWith(searchTerm)
    );
    setSearchTerm(searchTerm);
    setSearchResults(results);
  };

  const handleAddFood = (food) => {
    const updatedFoods = [...addedFoods, food];
    setAddedFoods(updatedFoods);
    saveAddedFoodsToLocalStorage(updatedFoods);
  };
  const handleDeleteFood = async (
    index,
    removeFromDatabase,
    fromSearchResults
  ) => {
    if (fromSearchResults) {
      const foodToDelete = searchResults[index];
      const updatedSearchResults = searchResults.filter((_, i) => i !== index);
      setSearchResults(updatedSearchResults);

      if (removeFromDatabase && foodToDelete && foodToDelete._id) {
        try {
          await axios.delete(
            `https://calorie-tracker-app-server.vercel.app/api/foods/${foodToDelete._id}`
          );
        } catch (error) {
          console.error("Error deleting food from database:", error);
        }
      } else {
        console.error("Food item or _id not found:", foodToDelete);
      }
    } else {
      const updatedFoods = addedFoods.filter((_, i) => i !== index);
      setAddedFoods(updatedFoods);
      saveAddedFoodsToLocalStorage(updatedFoods);
      if (removeFromDatabase && addedFoods[index] && addedFoods[index]._id) {
        try {
          await axios.delete(
            `https://calorie-tracker-app-server.vercel.app/api/foods/${addedFoods[index]._id}`
          );
        } catch (error) {
          console.error("Error deleting food from database:", error);
        }
      } else {
        console.error("Food item or _id not found:", addedFoods[index]);
      }
    }
  };
  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setFoodData({ ...foodData, [name]: value });
  };

  const handleClearAddedFoods = () => {
    setAddedFoods([]);
    localStorage.removeItem("addedFoods");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({
      name: "",
      servingSize: "",
      calories: "",
      proteins: "",
      carbohydrates: "",
      fats: "",
    });

    let formIsValid = true;

    // Validate name
    if (foodData.name.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Name is required." }));
      formIsValid = false;
    }

    // Validate serving size
    if (foodData.servingSize.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        servingSize: "Serving size is required.",
      }));
      formIsValid = false;
    }

    // Validate calories
    if (foodData.calories.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: "Calories are required.",
      }));
      formIsValid = false;
    }

    // Validate proteins
    if (foodData.proteins.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        proteins: "Proteins are required.",
      }));
      formIsValid = false;
    }

    // Validate carbohydrates
    if (foodData.carbohydrates.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbohydrates: "Carbohydrates are required.",
      }));
      formIsValid = false;
    }

    // Validate fats
    if (foodData.fats.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fats: "Fats are required.",
      }));
      formIsValid = false;
    }

    // Check if form is valid
    if (!formIsValid) {
      return;
    }
    try {
      await axios.post("https://calorie-tracker-app-server.vercel.app/api/foods/", foodData);
      setAddedFoods((prevFoods) => [...prevFoods, foodData]);
      setFoodData({
        name: "",
        servingSize: "",
        calories: "",
        proteins: "",
        carbohydrates: "",
        fats: "",
      });
      fetchAllFoods();
      setPopupOpen(false);
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  const totalCaloriesConsumed = addedFoods.reduce(
    (total, food) => total + parseInt(food.calories),
    0
  );
  localStorage.setItem("totalCaloriesConsumed", totalCaloriesConsumed);
  const totalProteinsConsumed = addedFoods.reduce(
    (total, food) => total + parseInt(food.proteins),
    0
  );
  localStorage.setItem("totalProteinsConsumed", totalProteinsConsumed);
  const totalCarbohydratesConsumed = addedFoods.reduce(
    (total, food) => total + parseInt(food.carbohydrates),
    0
  );
  localStorage.setItem(
    "totalCarbohydratesConsumed",
    totalCarbohydratesConsumed
  );
  const totalFatsConsumed = addedFoods.reduce(
    (total, food) => total + parseInt(food.fats),
    0
  );
  localStorage.setItem("totalFatsConsumed", totalFatsConsumed);

  // Logic for pagination of added foods
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = addedFoods.slice(indexOfFirstFood, indexOfLastFood);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Logic for pagination of search results
  const indexOfLastSearchResult = currentSearchPage * searchResultsPerPage;
  const indexOfFirstSearchResult =
    indexOfLastSearchResult - searchResultsPerPage;
  const currentSearchResults = searchResults.slice(
    indexOfFirstSearchResult,
    indexOfLastSearchResult
  );

  const paginateSearchResults = (pageNumber) =>
    setCurrentSearchPage(pageNumber);

  return (
    <Layout>
      <div className="meal-history-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <button className="add-food-btn" onClick={handleClearAddedFoods}>
          Next Day
        </button>
        <button
          className="add-food-btn"
          onClick={() => setPopupOpen(!isPopupOpen)}
        >
          Add Food
        </button>
        {isPopupOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close-btn"
                onClick={() => setPopupOpen(false)}
              >
                X
              </button>
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={foodData.name}
                    onChange={handleFormInputChange}
                  />
                  {errors.name && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.name}
                    </p>
                  )}
                </label>
                <label>
                  Serving Size (grams):
                  <input
                    type="text"
                    name="servingSize"
                    value={foodData.servingSize}
                    onChange={handleFormInputChange}
                  />
                  {errors.servingSize && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.servingSize}
                    </p>
                  )}
                </label>
                <label>
                  Calories:
                  <input
                    type="text"
                    name="calories"
                    value={foodData.calories}
                    onChange={handleFormInputChange}
                  />
                  {errors.calories && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.calories}
                    </p>
                  )}
                </label>
                <label>
                  Proteins:
                  <input
                    type="text"
                    name="proteins"
                    value={foodData.proteins}
                    onChange={handleFormInputChange}
                  />
                  {errors.proteins && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.proteins}
                    </p>
                  )}
                </label>
                <label>
                  Carbohydrates:
                  <input
                    type="text"
                    name="carbohydrates"
                    value={foodData.carbohydrates}
                    onChange={handleFormInputChange}
                  />
                  {errors.carbohydrates && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.carbohydrates}
                    </p>
                  )}
                </label>
                <label>
                  Fats:
                  <input
                    type="text"
                    name="fats"
                    value={foodData.fats}
                    onChange={handleFormInputChange}
                  />
                  {errors.fats && (
                    <p style={{ color: "red", fontSize: "0.8em" }}>
                      {errors.fats}
                    </p>
                  )}
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
        <div className="search-results-table">
          <h2>Added Foods</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Serving Size</th>
                <th>Calories</th>
                <th>Proteins</th>
                <th>Carbohydrates</th>
                <th>Fats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentFoods.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td>{food.servingSize}</td>
                  <td>{food.calories}</td>
                  <td>{food.proteins}</td>
                  <td>{food.carbohydrates}</td>
                  <td>{food.fats}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteFood(index, true, false)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentFoods.length < foodsPerPage}
            >
              Next
            </button>
          </div>
        </div>
        {searchTerm && (
          <div className="search-results-table">
            <h2>Search Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Serving Size</th>
                  <th>Calories</th>
                  <th>Proteins</th>
                  <th>Carbohydrates</th>
                  <th>Fats</th>
                  <th>Add</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentSearchResults.map((food, index) => (
                  <tr key={index}>
                    <td>{food.name}</td>
                    <td>{food.servingSize}</td>
                    <td>{food.calories}</td>
                    <td>{food.proteins}</td>
                    <td>{food.carbohydrates}</td>
                    <td>{food.fats}</td>
                    <td>
                      <button
                        className="add-food-btn"
                        onClick={() => handleAddFood(food)}
                      >
                        Add
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteFood(index, true, true)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => paginateSearchResults(currentSearchPage - 1)}
                disabled={currentSearchPage === 1}
              >
                Previous
              </button>
              <button
                className="pagination-button"
                onClick={() => paginateSearchResults(currentSearchPage + 1)}
                disabled={currentSearchResults.length < searchResultsPerPage}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MealHistory;
