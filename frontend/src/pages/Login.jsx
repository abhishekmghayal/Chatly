import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    // simple validation
    if (!formData.username || !formData.password) {
      setError("Please enter username and password");
      return;
    }

    API.post("/users/login", formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log("Login successful:", response.data);
        setSuccess("Login successful! Redirecting...");
        setFormData({
          username: "",
          password: "",
        });
        dispatch(setUser(response.data.user));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.error("Login error:", error);
        const errMsg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "Login failed";
        setError(errMsg);
      });
    // simulate successful login
    setSuccess("Login successful!");
    setTimeout(() => navigate("/"), 600);
  };

  const goSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-top">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to continue your conversations.</p>
        </div>
        <div className="auth-body">
          <form onSubmit={onSubmit} className="auth-form">
            {success && <div className="auth-success">{success}</div>}
            {error && <div className="auth-error">{error}</div>}

            <div>
              <label htmlFor="username" className="auth-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={onChange}
                className="auth-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="auth-input"
              />
            </div>

            <div>
              <button type="submit" className="auth-btn">
                Sign in
              </button>
            </div>
          </form>

          <p className="auth-link">
            Don't have an account?{" "}
            <a href="/signup" onClick={goSignup}>
              Register
            </a>
          </p>

          <p className="auth-footnote">
            By logging in you agree to our terms and privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
