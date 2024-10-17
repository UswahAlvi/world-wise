import { createContext, useContext, useState, useEffect, useReducer } from "react";

const URL = 'http://localhost:9000';
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "" // Defining error in the initial state
  };

  function reduce(state, action) {
    switch (action.type) {
      case 'loading':
        return {
          ...state,
          isLoading: true,
          error: "" // Clear error when starting a new request
        };
      case 'cities/loaded':
        return {
          ...state,
          isLoading: false,
          cities: action.payload,
          error: "" // Reset error
        };
      case 'city/loaded':
        return {
          ...state,
          isLoading: false,
          currentCity: action.payload,
          error: "" // Reset error
        };
      case 'city/created':
        return {
          ...state,
          isLoading: false,
          cities: [...state.cities, action.payload],
          currentCity: action.payload,
          error: "" // Reset error
        };
      case 'city/deleted':
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter(city => city.id !== action.payload),
          error: "" // Reset error
        };
      case 'error': // Handling errors
        return {
          ...state,
          isLoading: false,
          error: action.payload // Set the error message
        };
      default:
        throw new Error('Unknown action type in CitiesContext');
    }
  }

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reduce, initialState);

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch {
        dispatch({ type: 'error', payload: 'There was an error loading cities.' });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch {
      dispatch({ type: 'error', payload: 'There was an error loading city data.' });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch {
      dispatch({ type: 'error', payload: 'There was an error creating the city.' });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({ type: 'error', payload: 'There was an error deleting the city.' });
    }
  }

  return (
    <CitiesContext.Provider value={{
      cities,
      isLoading,
      currentCity,
      getCity,
      createCity,
      deleteCity,
      error // Return error in the context
    }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('useCities must be used within a CitiesProvider');
  return context;
}

export { CitiesProvider, useCities };
