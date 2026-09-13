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

    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const response = await fetch("/api/auth/register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          fullName: fullName,
          email: email,
          password: password
        })
      });


      const data = await response.text();


      if (!response.ok) {

        setError(data || "Registration failed.");

        return;
      }


      setSuccess(
        data || "Registration successful. Please login."
      );


      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (error) {

      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

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