import { useState } from "react";
import "./CreateTrip.css";

function CreateTrip() {

  const [tripData, setTripData] = useState({
    source: "",
    destination: "",
    days: "",
    budget: "",
    travelers: "",
    travelStyle: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTripData({
      ...tripData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Trip details submitted:");
    console.log(tripData);
  };

  return (
    <div className="create-trip-page">

      <div className="create-trip-container">

        <div className="create-trip-header">
          <p className="create-trip-label">
            PLAN YOUR JOURNEY
          </p>

          <h1>
            Create your <span>perfect trip.</span>
          </h1>

          <p className="create-trip-description">
            Tell us a few details about your trip and TripGenie AI
            will create a personalized itinerary for you.
          </p>
        </div>

        <form
          className="create-trip-form"
          onSubmit={handleSubmit}
        >

          {/* Source */}

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


          {/* Days */}

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


          {/* Submit */}

          <button
            type="submit"
            className="generate-trip-button"
          >
            Generate My Trip
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateTrip;