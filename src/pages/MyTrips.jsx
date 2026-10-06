import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyTrips.css";

function MyTrips() {

  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewingTripId, setViewingTripId] = useState(null);
  const [unsavingTripId, setUnsavingTripId] = useState(null);


  // ============================================
  // Fetch saved trips
  // ============================================

  useEffect(() => {

    const fetchSavedTrips = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setError("");

      try {

        const response = await fetch(
          "/api/saved-itineraries",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        console.log(
          "Saved trips API response status:",
          response.status
        );


        // JWT expired / unauthorized
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }


        if (!response.ok) {

          let errorMessage =
            `Failed to load saved trips. Status: ${response.status}`;

          try {

            const contentType =
              response.headers.get("content-type");

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
              "Could not read saved trips error:",
              error
            );

          }

          throw new Error(errorMessage);
        }


        const data = await response.json();

        console.log(
          "Saved trips data:",
          JSON.stringify(data, null, 2)
        );


        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid saved trips data received from the server."
          );
        }


        setTrips(data);

      } catch (error) {

        console.error(
          "Error fetching saved trips:",
          error
        );

        setTrips([]);

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

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!tripId) {
      setError("Trip ID is missing.");
      return;
    }

    setViewingTripId(tripId);
    setError("");

    try {

      const response = await fetch(
        `/api/ai/trips/${tripId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log(
        "View itinerary response status:",
        response.status
      );


      // JWT expired / unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }


      if (!response.ok) {

        let errorMessage =
          `Unable to load this itinerary. Status: ${response.status}`;

        try {

          const contentType =
            response.headers.get("content-type");

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
            "Could not read itinerary error:",
            error
          );

        }

        throw new Error(errorMessage);
      }


      const data = await response.json();

      console.log(
        "Itinerary loaded successfully:",
        data
      );


      if (!data || typeof data !== "object") {
        throw new Error(
          "Invalid itinerary data received from the server."
        );
      }


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

    } finally {

      setViewingTripId(null);

    }

  };


  // ============================================
  // Remove saved itinerary
  // ============================================

  const handleUnsave = async (tripId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!tripId) {
      setError("Trip ID is missing.");
      return;
    }

    setUnsavingTripId(tripId);
    setError("");

    try {

      const response = await fetch(
        `/api/saved-itineraries/${tripId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log(
        "Unsave response status:",
        response.status
      );


      // JWT expired / unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }


      if (!response.ok) {

        let errorMessage =
          `Unable to remove the saved itinerary. Status: ${response.status}`;

        try {

          const contentType =
            response.headers.get("content-type");

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
            "Could not read unsave error:",
            error
          );

        }

        throw new Error(errorMessage);
      }


      // Remove the trip from the screen
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

    } finally {

      setUnsavingTripId(null);

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


  // ============================================
  // Full page error state
  // ============================================

  if (error && trips.length === 0) {

    return (
      <div className="my-trips-page">

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


        <div className="my-trips-error-state">

          <h2>
            Unable to load your trips
          </h2>

          <p>
            {error}
          </p>

          <button
            className="create-trip-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

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
                    disabled={
                      viewingTripId === trip.tripId ||
                      unsavingTripId !== null
                    }
                    onClick={() =>
                      handleViewItinerary(
                        trip.tripId
                      )
                    }
                  >
                    {viewingTripId === trip.tripId
                      ? "Loading..."
                      : "View Itinerary"}
                  </button>


                  <button
                    className="unsave-button"
                    disabled={
                      unsavingTripId === trip.tripId ||
                      viewingTripId !== null
                    }
                    onClick={() =>
                      handleUnsave(
                        trip.tripId
                      )
                    }
                  >
                    {unsavingTripId === trip.tripId
                      ? "Removing..."
                      : "Unsave"}
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