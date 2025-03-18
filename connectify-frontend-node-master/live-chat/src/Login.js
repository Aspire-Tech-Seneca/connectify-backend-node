import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    navigate("/chat");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
