import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Form submitted:", formData);
    // include credentials and explicit content-type to help servers that require them
    API.post("/users/register", formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log("Signup successful:", response.data);
        setSuccess("Signup successful! Redirecting to login...");
        setFormData({
          name: "",
          email: "",
          password: "",
          bio: "",
          username: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        console.error("Signup error:", error);
        // show CORS or network related message to user
        const errMsg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "Signup failed";
        setError(errMsg);
      });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-top">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join and start chatting in seconds.</p>
        </div>
        <div className="auth-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {success && <div className="auth-success">{success}</div>}
            {error && <div className="auth-error">{error}</div>}
            <div>
              <label htmlFor="name" className="auth-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div>
              <label htmlFor="username" className="auth-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
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
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div>
              <label htmlFor="bio" className="auth-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="auth-textarea"
              />
            </div>

            <div>
              <button type="submit" className="auth-btn">
                Sign Up
              </button>
            </div>
          </form>

          <p className="auth-footnote">
            By signing up you agree to our terms and privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
