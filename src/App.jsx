import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary";

import "./App.css";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard page */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Create Trip page */}
        <Route
          path="/create-trip"
          element={<CreateTrip />}
        />

        {/* Generated Itinerary page */}
        <Route
          path="/itinerary"
          element={<Itinerary />}
        />

        {/* Default page */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;