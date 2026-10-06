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

  if (!token) {
    navigate("/login");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profile API response status:", response.status);

    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (!response.ok) {
      let errorMessage = `Failed to load profile. Status: ${response.status}`;

      try {
        const contentType = response.headers.get("content-type");

        if (
          contentType &&
          contentType.includes("application/json")
        ) {
          const errorData = await response.json();

          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else {
          const errorText = await response.text();

          if (errorText) {
            errorMessage = errorText;
          }
        }
      } catch (error) {
        console.error(
          "Could not read profile error:",
          error
        );
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    console.log(
      "Profile data:",
      JSON.stringify(data, null, 2)
    );

    if (!data || !data.email) {
      throw new Error("Invalid profile data received.");
    }

    setProfile(data);
    setFullName(data.fullName || "");

  } catch (error) {
    console.error("Profile error:", error);

    setProfile(null);

    setError(
      error.message ||
      "Unable to load profile. Please try again."
    );

  } finally {
    setIsLoading(false);
  }
};


    fetchProfile();

  }, [navigate]);


  // ==================== Update Profile ====================

const handleUpdate = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  const trimmedName = fullName.trim();

  if (!trimmedName) {
    setError("Please enter your full name.");
    return;
  }

  if (trimmedName.length < 2) {
    setError("Full name must be at least 2 characters.");
    return;
  }

  if (!profile?.email) {
    setError("Profile information is not available.");
    return;
  }

  setIsUpdating(true);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: trimmedName,
        email: profile.email,
      }),
    });

    console.log(
      "Update profile API response status:",
      response.status
    );

    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    let data = null;

    try {
      const contentType = response.headers.get("content-type");

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const responseText = await response.text();

        if (responseText) {
          data = { message: responseText };
        }
      }
    } catch (error) {
      console.error(
        "Could not read update profile response:",
        error
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        `Failed to update profile. Status: ${response.status}`
      );
    }

    if (!data) {
      throw new Error("Invalid response received from server.");
    }

    setProfile(data);
    setFullName(data.fullName || trimmedName);

    setSuccess("Profile updated successfully.");

  } catch (error) {
    console.error("Update profile error:", error);

    setError(
      error.message ||
      "Unable to update profile. Please try again."
    );

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

  if (error && !profile) {
  return (
    <div className="profile-page">
      <div className="profile-error-state">
        <h2>Unable to load profile</h2>

        <p>{error}</p>

        <button
          className="profile-retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
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