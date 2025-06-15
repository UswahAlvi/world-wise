import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import styles from "./User.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function User() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className={styles.user}>
      <FontAwesomeIcon icon={faUser} className={styles.icon} />
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
