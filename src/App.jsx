import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

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

        {/* Register page */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard page */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-trips"
  element={
    <ProtectedRoute>
      <MyTrips />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/create-trip"
  element={
    <ProtectedRoute>
      <CreateTrip />
    </ProtectedRoute>
  }
/>

        {/* Generated Itinerary page */}
<Route
  path="/itinerary"
  element={
    <ProtectedRoute>
      <Itinerary />
    </ProtectedRoute>
  }
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