import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


const handleSubmit = async (event) => {

  // Prevent normal HTML form submission
  event.preventDefault();

  // Clear previous messages
  setError("");
  setSuccess("");

  // Remove accidental spaces
  const trimmedFullName = fullName.trim();
  const trimmedEmail = email.trim();

  // Validate full name
  if (!trimmedFullName) {
    setError("Please enter your full name.");
    return;
  }

  // Validate full name length
  if (trimmedFullName.length < 2) {
    setError("Full name must contain at least 2 characters.");
    return;
  }

  // Validate email
  if (!trimmedEmail) {
    setError("Please enter your email.");
    return;
  }

  // Check email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  // Validate password
  if (!password.trim()) {
    setError("Please enter your password.");
    return;
  }

  // Check minimum password length
  if (password.length < 6) {
    setError("Password must contain at least 6 characters.");
    return;
  }

  // Start loading only after validation succeeds
  setLoading(true);

  try {

    // Send registration request to Spring Boot backend
    const response = await fetch("/api/auth/register", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: password
      })
    });

    // Registration endpoint currently returns text
    const data = await response.text();

    // Check whether registration failed
    if (!response.ok) {

      setError(data || "Registration failed.");

      return;
    }

    // Registration successful
    setSuccess(
      data || "Registration successful. Please login."
    );

    // Redirect to login after showing success message
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {

    // Handle network/server errors
    console.error("Registration error:", error);

    setError(
      "Unable to connect to the server. Please try again."
    );

  } finally {

    // Stop loading
    setLoading(false);
  }
};


  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-left">

          <div className="brand">
            TripGenie AI
          </div>

          <h1>
            Start planning your
            <span> perfect trip.</span>
          </h1>

          <p>
            Create an account and let TripGenie AI
            create personalized travel itineraries for you.
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


        <div className="register-right">

          <div className="register-card">

            <h2>Create Account</h2>

            <p className="register-subtitle">
              Create an account to start planning your journey.
            </p>


            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    minLength="6"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <small>
                  Password must contain at least 6 characters.
                </small>

              </div>


              {error && (
                <p className="register-error">
                  {error}
                </p>
              )}


              {success && (
                <p className="register-success">
                  {success}
                </p>
              )}


              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>


            <p className="login-text">

              Already have an account?

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;