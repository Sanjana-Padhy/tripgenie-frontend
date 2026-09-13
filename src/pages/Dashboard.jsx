import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  // Store dashboard data received from backend
  const [dashboardData, setDashboardData] = useState(null);

  // Store loading state
  const [isLoading, setIsLoading] = useState(true);

  // Store error message
  const [error, setError] = useState("");

  // ==================== Get Dashboard Data ====================
  useEffect(() => {

    const fetchDashboardData = async () => {

      const token = localStorage.getItem("token");

      // If user is not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      try {

        const response = await fetch("/api/dashboard", {
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
          throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();

       console.log("Dashboard data:", JSON.stringify(data, null, 2));

        setDashboardData(data);

      } catch (error) {

        console.error("Dashboard error:", error);
        setError(error.message);

      } finally {

        setIsLoading(false);

      }
    };

    fetchDashboardData();

  }, [navigate]);


  // Navigate to Create Trip page
  const handleCreateTrip = () => {
    navigate("/create-trip");
  };


  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // ==================== Loading ====================
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <p>Loading dashboard...</p>
      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* ==================== Navigation Bar ==================== */}
      <nav className="dashboard-navbar">

        {/* Application Logo */}
        <div className="dashboard-brand">
          TripGenie <span>AI</span>
        </div>

        {/* Navigation Links */}
        <div className="dashboard-nav-links">

          {/* Dashboard */}
          <button
            className="nav-link active"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          {/* My Trips */}
          <button
            className="nav-link"
            onClick={() => navigate("/my-trips")}
          >
            My Trips
          </button>

          {/* Profile */}
          <button
            className="nav-link"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          {/* Logout */}
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ==================== Main Dashboard ==================== */}
      <main className="dashboard-content">


        {/* ==================== Welcome Section ==================== */}
        <section className="welcome-section">

          <div>

            <p className="welcome-label">
              YOUR TRAVEL ASSISTANT
            </p>

            <h1>
              Plan your next adventure
              <span> with AI.</span>
            </h1>

            <p className="welcome-description">
              Create personalized travel itineraries based on your
              destination, budget, travel style and trip duration.
            </p>

          </div>


          {/* Create New Trip */}
          <button
            className="create-trip-button"
            onClick={handleCreateTrip}
          >
            + Create New Trip
          </button>

        </section>


        {/* ==================== Error Message ==================== */}
        {error && (
          <p className="dashboard-error">
            {error}
          </p>
        )}


        {/* ==================== Statistics ==================== */}
        <section className="stats-grid">


          {/* Total Trips */}
          <div className="stat-card">

            <div className="stat-icon">
              ✈
            </div>

            <div>
              <p>Total Trips</p>
              <h2>{dashboardData?.totalTrips ?? 0}</h2>
            </div>

          </div>


          {/* Saved Trips */}
          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <p>Saved Trips</p>
              <h2>{dashboardData?.savedTrips ?? 0}</h2>
            </div>

          </div>


          {/* Total Budget */}
          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>
              <p>Total Budget</p>
              <h2>
                ₹{dashboardData?.totalBudget ?? 0}
              </h2>
            </div>

          </div>

        </section>


        {/* ==================== Recent Trips ==================== */}
        <section className="recent-trips-section">


          {/* Section Heading */}
          <div className="section-heading">

            <div>

              <h2>
                Recent Trips
              </h2>

              <p>
                Your recently created travel plans will appear here.
              </p>

            </div>


            {/* View All Trips */}
            <button
              className="view-all-button"
              onClick={() => navigate("/my-trips")}
            >
              View All
            </button>

          </div>


          {/* ==================== Recent Trips List ==================== */}

          {dashboardData?.recentTrips?.length > 0 ? (

            <div className="recent-trips-list">

              {dashboardData.recentTrips.map((trip) => (

                <div
                  className="recent-trip-card"
                  key={trip.id}
                >

                  <div>
                    <h3>{trip.destination}</h3>

                    <p>
                      ₹{trip.budget} · {trip.travelStyle}
                    </p>

                    <p>
                      Status: {trip.status}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* ==================== Empty State ==================== */
            <div className="empty-trips">

              <div className="empty-icon">
                ✈
              </div>

              <h3>
                No trips yet
              </h3>

              <p>
                Start planning your first trip and let TripGenie AI
                create a personalized itinerary for you.
              </p>


              {/* Create First Trip */}
              <button
                className="empty-create-button"
                onClick={handleCreateTrip}
              >
                Create Your First Trip
              </button>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;