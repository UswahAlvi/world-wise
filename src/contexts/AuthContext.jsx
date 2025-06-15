import { createContext, useContext, useReducer, useEffect } from "react";
import { loginUser, registerUser } from "../services/userApi";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
    case "register":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, token, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [isAuthenticated, user, token]);

  async function login(email, password) {
    try {
      const { user, token } = await loginUser({ email, password });
      dispatch({ type: "login", payload: { user, token } });
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    }
  }

  async function register(name, email, password) {
    try {
      const { user, token } = await registerUser({ name, email, password });
      dispatch({ type: "register", payload: { user, token } });
    } catch (err) {
      console.error("Registration failed:", err.message);
      throw err;
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Trying to use context outside of AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
