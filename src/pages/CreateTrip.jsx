import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTrip.css";

function CreateTrip() {

  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    source: "",
    destination: "",
    days: "",
    budget: "",
    travelers: "",
    travelStyle: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  // ============================================
  // Handle form changes
  // ============================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setTripData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };


  // ============================================
  // Generate itinerary
  // ============================================

  const handleSubmit = async (event) => {

    event.preventDefault();

setError("");

// Remove accidental spaces from text fields
const source = tripData.source.trim();
const destination = tripData.destination.trim();

// Convert numeric fields to numbers
const days = Number(tripData.days);
const budget = Number(tripData.budget);
const travelers = Number(tripData.travelers);

// Validate starting location
if (!source) {
  setError("Please enter your starting location.");
  return;
}

// Validate destination
if (!destination) {
  setError("Please enter your destination.");
  return;
}

// Make sure source and destination are different
if (source.toLowerCase() === destination.toLowerCase()) {
  setError("Starting location and destination cannot be the same.");
  return;
}

// Validate number of days
if (!Number.isInteger(days) || days < 1) {
  setError("Number of days must be at least 1.");
  return;
}

// Validate budget
if (!Number.isFinite(budget) || budget <= 0) {
  setError("Please enter a valid budget greater than 0.");
  return;
}

// Validate travelers
if (!Number.isInteger(travelers) || travelers < 1) {
  setError("Number of travelers must be at least 1.");
  return;
}

// Validate travel style
if (!tripData.travelStyle) {
  setError("Please select a travel style.");
  return;
}

// Start loading only after validation succeeds
setIsLoading(true);

    try {

      // ==========================================
      // Get JWT token
      // ==========================================

      const token = localStorage.getItem("token");

      console.log("JWT token exists:", !!token);

      if (!token) {

        setError(
          "Your login session has expired. Please login again."
        );

        return;
      }


      // ==========================================
      // Prepare request body
      // ==========================================

      const requestBody = {
  source: source,
  destination: destination,
  days: days,
  budget: budget,
  travelers: travelers,
  travelStyle: tripData.travelStyle
};


      console.log(
        "Sending trip request:",
        requestBody
      );


      // ==========================================
      // Call Spring Boot through Vite proxy
      // ==========================================

      const response = await fetch(
        "/api/ai/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(requestBody)
        }
      );


      console.log(
        "AI API response status:",
        response.status
      );


      // ==========================================
      // Handle Unauthorized
      // ==========================================

    if (response.status === 401) {
  console.error("Backend rejected the JWT token.");

  localStorage.removeItem("token");

  setError(
    "Your login session has expired. Please login again."
  );

  navigate("/login");
  return;
}


      // ==========================================
      // Handle other errors
      // ==========================================

      if (!response.ok) {

        let errorMessage =
          `Request failed with status ${response.status}`;

        try {

          const contentType =
            response.headers.get("content-type");

          if (
            contentType &&
            contentType.includes("application/json")
          ) {

            const errorData =
              await response.json();

            if (errorData.message) {
              errorMessage = errorData.message;
            }

          } else {
  const errorText = await response.text();

  if (errorText) {
    console.error("Backend error:", errorText);
    errorMessage = errorText;
  }
}

        } catch (error) {

          console.error( 
            "Could not read backend error:",
            error
          );
        }

        throw new Error(errorMessage);
      }


      // ==========================================
      // Read successful response
      // ==========================================

      const itinerary =
        await response.json();

      console.log(
        "AI itinerary generated successfully:"
      );

      console.log(itinerary);


      // ==========================================
      // Temporary success
      // ==========================================

// ==========================================
// Navigate to itinerary page
// ==========================================

setError("");

console.log(
  "Navigating to itinerary page..."
);

navigate("/itinerary", {
  state: itinerary
});


      /*
       * Later:
       *
       * navigate("/itinerary", {
       *   state: itinerary
       * });
       */

    } catch (error) {

      console.error(
        "Failed to generate itinerary:",
        error
      );

      setError(
        error.message ||
        "Unable to generate your trip. Please try again."
      );

    } finally {

      setIsLoading(false);
    }
  };


  return (
    <div className="create-trip-page">

      <div className="create-trip-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="create-trip-header">

          <p className="create-trip-label">
            PLAN YOUR JOURNEY
          </p>

          <h1>
            Create your <span>perfect trip.</span>
          </h1>

          <p className="create-trip-description">
            Tell us a few details about your trip and
            TripGenie AI will create a personalized
            itinerary for you.
          </p>

        </div>


        {/* ======================================
            FORM
        ====================================== */}

        <form
          className="create-trip-form"
          onSubmit={handleSubmit}
        >

          {/* Starting From */}

          <div className="form-group">

            <label htmlFor="source">
              Starting From
            </label>

            <input
              id="source"
              name="source"
              type="text"
              placeholder="e.g. Bhubaneswar, Odisha"
              value={tripData.source}
              onChange={handleChange}
              required
            />

          </div>


          {/* Destination */}

          <div className="form-group">

            <label htmlFor="destination">
              Destination
            </label>

            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="e.g. Goa, India"
              value={tripData.destination}
              onChange={handleChange}
              required
            />

          </div>


          {/* Number of Days */}

          <div className="form-group">

            <label htmlFor="days">
              Number of Days
            </label>

            <input
              id="days"
              name="days"
              type="number"
              placeholder="e.g. 5"
              min="1"
              value={tripData.days}
              onChange={handleChange}
              required
            />

          </div>


          {/* Budget */}

          <div className="form-group">

            <label htmlFor="budget">
              Total Budget (₹)
            </label>

            <input
              id="budget"
              name="budget"
              type="number"
              placeholder="e.g. 30000"
              min="1"
              value={tripData.budget}
              onChange={handleChange}
              required
            />

          </div>


          {/* Travelers */}

          <div className="form-group">

            <label htmlFor="travelers">
              Number of Travelers
            </label>

            <input
              id="travelers"
              name="travelers"
              type="number"
              placeholder="e.g. 2"
              min="1"
              value={tripData.travelers}
              onChange={handleChange}
              required
            />

          </div>


          {/* Travel Style */}

          <div className="form-group">

            <label htmlFor="travelStyle">
              Travel Style
            </label>

            <select
              id="travelStyle"
              name="travelStyle"
              value={tripData.travelStyle}
              onChange={handleChange}
              required
            >

              <option value="">
                Select your travel style
              </option>

              <option value="Relaxed">
                Relaxed
              </option>

              <option value="Adventure">
                Adventure
              </option>

              <option value="Luxury">
                Luxury
              </option>

              <option value="Budget">
                Budget
              </option>

              <option value="Family">
                Family
              </option>

              <option value="Romantic">
                Romantic
              </option>

            </select>

          </div>


          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (

            <p
              style={{
                gridColumn: "1 / -1",
                margin: "0",
                color: "#dc2626",
                fontSize: "14px",
                textAlign: "center"
              }}
            >
              {error}
            </p>

          )}


          {/* ==================================
              SUBMIT BUTTON
          ================================== */}

          <button
            type="submit"
            className="generate-trip-button"
            disabled={isLoading}
          >

            {isLoading
              ? "Generating Your Trip..."
              : "Generate My Trip"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateTrip;