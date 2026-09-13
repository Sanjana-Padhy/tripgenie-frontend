import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyTrips.css";

function MyTrips() {

  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // Fetch saved trips
  // ============================================

  useEffect(() => {

    const fetchSavedTrips = async () => {

      try {

        const token = localStorage.getItem("token");

        // No JWT token
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "/api/saved-itineraries",
          {
            method: "GET",

            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        // JWT expired / unauthorized
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load your saved trips."
          );
        }

        const data = await response.json();

        setTrips(data);

      } catch (error) {

        console.error(
          "Error fetching saved trips:",
          error
        );

        setError(
          error.message ||
          "Something went wrong while loading your trips."
        );

      } finally {

        setIsLoading(false);

      }
    };

    fetchSavedTrips();

  }, [navigate]);


  // ============================================
  // View complete itinerary
  // ============================================

  const handleViewItinerary = async (tripId) => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `/api/ai/trips/${tripId}`,
        {
          method: "GET",

          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load this itinerary."
        );
      }

      const data = await response.json();

      /*
       * The backend returns the stored AI itinerary.
       * Send that complete itinerary to the existing
       * Itinerary page through React Router state.
       */
      navigate("/itinerary", {
        state: data
      });

    } catch (error) {

      console.error(
        "Error loading itinerary:",
        error
      );

      setError(
        error.message ||
        "Unable to open the itinerary."
      );

    }
  };


  // ============================================
  // Remove saved itinerary
  // ============================================

  const handleUnsave = async (tripId) => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `/api/saved-itineraries/${tripId}`,
        {
          method: "DELETE",

          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to remove the saved itinerary."
        );
      }

      // Remove the trip from the screen immediately
      setTrips((previousTrips) =>
        previousTrips.filter(
          (trip) => trip.tripId !== tripId
        )
      );

    } catch (error) {

      console.error(
        "Error removing saved itinerary:",
        error
      );

      setError(
        error.message ||
        "Unable to remove the itinerary."
      );

    }
  };


  // ============================================
  // Loading state
  // ============================================

  if (isLoading) {

    return (
      <div className="my-trips-page">

        <div className="my-trips-message">
          Loading your trips...
        </div>

      </div>
    );
  }


  return (

    <div className="my-trips-page">

      {/* ======================================
          Navigation Bar
      ====================================== */}

      <nav className="my-trips-navbar">

        <div className="my-trips-brand">
          TripGenie <span>AI</span>
        </div>

        <div className="my-trips-nav-links">

          <button
            className="my-trips-nav-link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="my-trips-nav-link active"
            onClick={() => navigate("/my-trips")}
          >
            My Trips
          </button>

          <button
            className="my-trips-nav-link"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="my-trips-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          Main Content
      ====================================== */}

      <main className="my-trips-content">

        <div className="my-trips-header">

          <div>

            <p className="my-trips-label">
              YOUR TRAVEL PLANS
            </p>

            <h1>
              My Trips
            </h1>

            <p>
              View and manage your saved AI-generated
              travel itineraries.
            </p>

          </div>

          <button
            className="create-trip-button"
            onClick={() => navigate("/create-trip")}
          >
            + Create New Trip
          </button>

        </div>


        {/* Error */}

        {error && (
          <div className="my-trips-error">
            {error}
          </div>
        )}


        {/* ======================================
            Empty State
        ====================================== */}

        {trips.length === 0 && !error ? (

          <div className="my-trips-empty">

            <div className="my-trips-empty-icon">
              ✈
            </div>

            <h2>
              No saved trips yet
            </h2>

            <p>
              Create a trip and save your itinerary
              to see it here.
            </p>

            <button
              onClick={() => navigate("/create-trip")}
            >
              Create Your First Trip
            </button>

          </div>

        ) : (

          /* ======================================
              Saved Trip Cards
          ====================================== */

          <div className="my-trips-grid">

            {trips.map((trip) => (

              <div
                className="trip-card"
                key={trip.tripId}
              >

                <div className="trip-card-top">

                  <div className="trip-icon">
                    ✈
                  </div>

                  <span className="saved-badge">
                    ✓ Saved
                  </span>

                </div>


                <h2>
                  {trip.destination}
                </h2>


                <div className="trip-details">

                  <div>
                    <span>
                      Budget
                    </span>

                    <strong>
                      ₹{Number(
                        trip.budget
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Travel Style
                    </span>

                    <strong>
                      {trip.travelStyle}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {trip.status}
                    </strong>
                  </div>

                </div>


                <div className="trip-card-actions">

                  <button
                    className="view-itinerary-button"
                    onClick={() =>
                      handleViewItinerary(
                        trip.tripId
                      )
                    }
                  >
                    View Itinerary
                  </button>

                  <button
                    className="unsave-button"
                    onClick={() =>
                      handleUnsave(
                        trip.tripId
                      )
                    }
                  >
                    Unsave
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyTrips;