import { useState } from "react";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login submitted");
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-left">

          <div className="brand">
            TripGenie AI
          </div>

          <h1>
            Plan your perfect trip
            <span> with AI.</span>
          </h1>

          <p>
            Create personalized travel itineraries based on your
            destination, budget, travel style and number of days.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span>✈</span>
              <p>AI-powered travel planning</p>
            </div>

            <div className="feature-item">
              <span>₹</span>
              <p>Budget-friendly itineraries</p>
            </div>

            <div className="feature-item">
              <span>✓</span>
              <p>Save your trips for later</p>
            </div>

          </div>

        </div>

        <div className="login-right">

          <div className="login-card">

            <h2>Welcome back</h2>

            <p className="login-subtitle">
              Login to continue planning your journey.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              <div className="forgot-password">
                <button type="button">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Login
              </button>

            </form>

            <p className="register-text">
              Don't have an account?
              <button type="button">
                Create Account
              </button>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;