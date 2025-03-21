/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, FormControl, InputLabel, FilledInput, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:1337/login", userForm);

    if (response.data.success) {
      localStorage.setItem("authToken", response.data.authToken);
      window.dispatchEvent(new Event("storage")); // Notify other components
      navigate("/"); // Redirect to Dashboard
    }
  } catch (err) {
    setError("Invalid username or password!");
  }
};
  return (
    <div className="LoginMain">
      <div className="LoginContent">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="dense"
          value={userForm.username}
          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
        />

        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? "text" : "password"}
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;

