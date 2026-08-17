import { useLocation, useNavigate } from "react-router-dom";
import "./Itinerary.css";

function Itinerary() {

  const location = useLocation();
  const navigate = useNavigate();

  const itinerary = location.state;

  // If user directly opens /itinerary without generated data
  if (!itinerary) {

    return (
      <div className="itinerary-page">

        <div className="itinerary-empty">

          <h2>
            No itinerary found
          </h2>

          <p>
            Please generate a trip first.
          </p>

          <button
            onClick={() => navigate("/create-trip")}
          >
            Create a Trip
          </button>

        </div>

      </div>
    );
  }


  return (

    <div className="itinerary-page">

      <div className="itinerary-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="itinerary-header">

          <p className="itinerary-label">
            YOUR AI-GENERATED ITINERARY
          </p>

          <h1>
            {itinerary.source}
            <span> → </span>
            {itinerary.destination}
          </h1>

          <p className="itinerary-description">
            Your personalized trip planned by TripGenie AI.
          </p>

        </div>


        {/* =====================================
            TRIP SUMMARY
        ===================================== */}

        <div className="trip-summary">

          <div className="summary-card">

            <span className="summary-label">
              Destination
            </span>

            <strong>
              {itinerary.destination}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Travelers
            </span>

            <strong>
              {itinerary.travelers}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Total Budget
            </span>

            <strong>
              ₹{Number(itinerary.totalBudget).toLocaleString("en-IN")}
            </strong>

          </div>


          <div className="summary-card">

            <span className="summary-label">
              Duration
            </span>

            <strong>
              {itinerary.days.length} Days
            </strong>

          </div>

        </div>


        {/* =====================================
            DAYS
        ===================================== */}

        <div className="days-container">

          {itinerary.days.map((day) => (

            <div
              className="day-card"
              key={day.day}
            >

              {/* Day Header */}

              <div className="day-header">

                <div>

                  <p className="day-number">
                    DAY {day.day}
                  </p>

                  <h2>
                    {day.title}
                  </h2>

                </div>

              </div>


              {/* Activities */}

              <div className="activities">

                {day.activities.map((activity) => (

                  <div
                    className="activity-card"
                    key={activity.number}
                  >

                    <div className="activity-number">
                      {activity.number}
                    </div>


                    <div className="activity-content">

                      <div className="activity-top">

                        <h3>
                          {activity.activity}
                        </h3>

                        <span className="activity-time">
                          {activity.time}
                        </span>

                      </div>


                      <p className="activity-location">
                        📍 {activity.location}
                      </p>


                      <p className="activity-description">
                        {activity.description}
                      </p>


                      <p className="activity-cost">
                        Estimated Cost: ₹
                        {Number(
                          activity.estimatedCost
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>


        {/* =====================================
            ACTIONS
        ===================================== */}

        <div className="itinerary-actions">

          <button
            className="back-button"
            onClick={() => navigate("/create-trip")}
          >
            Create Another Trip
          </button>

        </div>

      </div>

    </div>
  );
}

export default Itinerary;