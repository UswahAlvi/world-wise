import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const URL = "https://world-wise-server-gnl3.onrender.com/api";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const { token } = useAuth();

  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "loading":
        return { ...state, isLoading: true, error: "" };
      case "cities/loaded":
        return { ...state, isLoading: false, cities: action.payload };
      case "city/loaded":
        return { ...state, isLoading: false, currentCity: action.payload };
      case "city/created":
        return {
          ...state,
          isLoading: false,
          cities: [...state.cities, action.payload],
          currentCity: action.payload,
        };
      case "city/deleted":
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((city) => city._id !== action.payload),
        };
      case "error":
        return { ...state, isLoading: false, error: action.payload };
      default:
        throw new Error("Unknown action type");
    }
  }

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Load cities either from API or localStorage
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      // Logged in: fetch from server
      if (token) {
        try {
          const res = await fetch(`${URL}/cities`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          dispatch({ type: "cities/loaded", payload: data });
        } catch {
          dispatch({ type: "error", payload: "Error loading cities" });
        }
      } else {
        // Anonymous user: load from localStorage
        const localCities = JSON.parse(localStorage.getItem("worldwise-cities")) || [];
        dispatch({ type: "cities/loaded", payload: localCities });
      }
    }

    fetchCities();
  }, [token]);

  async function getCity(id) {
    dispatch({ type: "loading" });

    if (token) {
      try {
        const res = await fetch(`${URL}/cities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({ type: "error", payload: "Error loading city" });
      }
    } else {
      // Anonymous: find in localStorage
      const localCities = JSON.parse(localStorage.getItem("worldwise-cities")) || [];
      const city = localCities.find((city) => city._id === id);
      dispatch({ type: "city/loaded", payload: city || {} });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    if (token) {
      try {
        const res = await fetch(`${URL}/cities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCity),
        });
        const data = await res.json();
        dispatch({ type: "city/created", payload: data });
      } catch {
        dispatch({ type: "error", payload: "Error creating city" });
      }
    } else {
      // Anonymous: save to localStorage
      const localCities = JSON.parse(localStorage.getItem("worldwise-cities")) || [];
      const tempId = Date.now().toString();
      const newCityWithId = { ...newCity, _id: tempId };
      const updatedCities = [...localCities, newCityWithId];
      localStorage.setItem("worldwise-cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/created", payload: newCityWithId });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    if (token) {
      try {
        await fetch(`${URL}/cities/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: "city/deleted", payload: id });
      } catch {
        dispatch({ type: "error", payload: "Error deleting city" });
      }
    } else {
      // Anonymous: remove from localStorage
      const localCities = JSON.parse(localStorage.getItem("worldwise-cities")) || [];
      const updatedCities = localCities.filter((city) => city._id !== id);
      localStorage.setItem("worldwise-cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/deleted", payload: id });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) throw new Error("useCities must be used within CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
