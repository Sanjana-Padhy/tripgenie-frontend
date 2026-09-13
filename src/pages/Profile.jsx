import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  // Store profile information received from backend
  const [profile, setProfile] = useState(null);

  // Store the name entered by the user
  const [fullName, setFullName] = useState("");

  // Store loading state while profile is being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Store update loading state
  const [isUpdating, setIsUpdating] = useState(false);

  // Store error message
  const [error, setError] = useState("");

  // Store success message
  const [success, setSuccess] = useState("");


  // ==================== Get Profile ====================

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      // If user is not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      try {

        // Call Spring Boot profile API
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        // JWT expired or unauthorized
        if (response.status === 401) {

          localStorage.removeItem("token");

          navigate("/login");

          return;
        }


        if (!response.ok) {
          throw new Error("Failed to load profile");
        }


        // Convert JSON response into JavaScript object
        const data = await response.json();

        console.log(
          "Profile data:",
          JSON.stringify(data, null, 2)
        );


        // Store profile data
        setProfile(data);

        // Put existing name into input field
        setFullName(data.fullName);

      } catch (error) {

        console.error("Profile error:", error);

        setError(error.message);

      } finally {

        setIsLoading(false);

      }
    };


    fetchProfile();

  }, [navigate]);


  // ==================== Update Profile ====================

  const handleUpdate = async (event) => {

    // Prevent page refresh
    event.preventDefault();

    // Clear old messages
    setError("");
    setSuccess("");

    // Start update loading
    setIsUpdating(true);


    try {

      const token = localStorage.getItem("token");


      // Send updated profile to backend
      const response = await fetch("/api/user/profile", {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName: fullName,
          email: profile.email,
        }),
      });


      // JWT expired
      if (response.status === 401) {

        localStorage.removeItem("token");

        navigate("/login");

        return;
      }


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to update profile"
        );
      }


      // Update profile shown on screen
      setProfile(data);

      setFullName(data.fullName);


      // Show success message
      setSuccess("Profile updated successfully.");

    } catch (error) {

      console.error("Update profile error:", error);

      setError(error.message);

    } finally {

      setIsUpdating(false);

    }
  };


  // ==================== Logout ====================

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };


  // ==================== Loading ====================

  if (isLoading) {

    return (
      <div className="profile-page">
        <p className="profile-loading">
          Loading profile...
        </p>
      </div>
    );
  }


  // ==================== Profile Page ====================

  return (

    <div className="profile-page">


      {/* ==================== Navigation Bar ==================== */}

      <nav className="profile-navbar">

        <div className="profile-brand">
          TripGenie <span>AI</span>
        </div>


        <div className="profile-nav-links">

          <button
            className="profile-nav-link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>


          <button
            className="profile-nav-link"
            onClick={() => navigate("/my-trips")}
          >
            My Trips
          </button>


          <button
            className="profile-nav-link active"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>


          <button
            className="profile-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ==================== Main Content ==================== */}

      <main className="profile-content">


        <div className="profile-header">

          <p className="profile-label">
            YOUR ACCOUNT
          </p>

          <h1>
            Profile
          </h1>

          <p>
            View and update your TripGenie account information.
          </p>

        </div>


        {/* ==================== Profile Card ==================== */}

        <section className="profile-card">


          {/* Profile Icon */}

          <div className="profile-avatar">
            {profile?.fullName
              ? profile.fullName.charAt(0).toUpperCase()
              : "U"}
          </div>


          <form onSubmit={handleUpdate}>


            {/* Full Name */}

            <div className="profile-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
              />

            </div>


            {/* Email */}

            <div className="profile-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={profile?.email || ""}
                readOnly
              />

              <small>
                Email cannot be changed from the profile page.
              </small>

            </div>


            {/* Error */}

            {error && (
              <p className="profile-error">
                {error}
              </p>
            )}


            {/* Success */}

            {success && (
              <p className="profile-success">
                {success}
              </p>
            )}


            {/* Update Button */}

            <button
              type="submit"
              className="profile-update-button"
              disabled={isUpdating}
            >
              {isUpdating
                ? "Updating..."
                : "Update Profile"}
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}

export default Profile;