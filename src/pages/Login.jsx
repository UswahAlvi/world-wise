import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import PageNav from '../components/PageNav'
import {useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Button from "../components/Button.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login,isAuthenticated}=useAuth();
  const navigate=useNavigate();

  useEffect(function(){
      if(isAuthenticated){
        navigate('/app');
      }
  },[isAuthenticated])
  function handleSubmit(e){
    e.preventDefault();
    login(email,password);
  }
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary'>Login</Button></div>
      </form>
      <div style={{display:"flex",justifyContent:"center", alignItems:"center", fontSize:"18px", gap: '10px'}}>
          Not Registered? <Button type='primary' onClick={()=>navigate('/register')}> Go here </Button>
      </div>
    </main>
  );
}
