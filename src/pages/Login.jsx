import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  // Store the email entered by the user
  const [email, setEmail] = useState("");

  // Store the password entered by the user
  const [password, setPassword] = useState("");

  // Control whether the password is visible
  const [showPassword, setShowPassword] = useState(false);

  // Store error messages
  const [error, setError] = useState("");

  // Store loading state while login request is running
  const [loading, setLoading] = useState(false);

  // Used to navigate to another React page
  const navigate = useNavigate();


  // This function runs when the Login button is clicked
  const handleSubmit = async (event) => {

    // Prevent normal HTML form submission
    event.preventDefault();

    // Remove previous error message
    setError("");

    // Start loading
    setLoading(true);

    try {

      // Send login request to Spring Boot backend
      const response = await fetch("/api/auth/login", {

        // HTTP method
        method: "POST",

        // Tell backend that we are sending JSON
        headers: {
          "Content-Type": "application/json"
        },

        // Convert JavaScript object into JSON
        body: JSON.stringify({
          email: email,
          password: password
        })
      });


      // Convert backend response into JavaScript object
      const data = await response.json();


      // Check whether login was successful
      if (!response.ok || !data.token) {

        // Display backend error message
        setError(data.message || "Login failed");

        return;
      }


      // Store JWT token in browser localStorage
      localStorage.setItem("token", data.token);

      // Store user's email for later use
      localStorage.setItem("userEmail", email);


      // Login successful
      console.log("Login successful");



      // Move user to dashboard
      navigate("/dashboard");

    } catch (error) {

      // Handle network/server errors
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      // Stop loading
      setLoading(false);
    }
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


              {/* Error message */}
              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}


              <div className="forgot-password">

                <button type="button">
                  Forgot Password?
                </button>

              </div>


              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
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