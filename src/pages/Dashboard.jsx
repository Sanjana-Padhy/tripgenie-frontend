import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  // Navigate to Create Trip page
  const handleCreateTrip = () => {
    navigate("/create-trip");
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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


        {/* ==================== Statistics ==================== */}
        <section className="stats-grid">


          {/* Total Trips */}
          <div className="stat-card">

            <div className="stat-icon">
              ✈
            </div>

            <div>
              <p>Total Trips</p>
              <h2>0</h2>
            </div>

          </div>


          {/* Saved Trips */}
          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <p>Saved Trips</p>
              <h2>0</h2>
            </div>

          </div>


          {/* Total Budget */}
          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>
              <p>Total Budget</p>
              <h2>₹0</h2>
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


          {/* ==================== Empty State ==================== */}
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

        </section>

      </main>

    </div>
  );
}

export default Dashboard;