import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { Route, Routes } from "react-router-dom";

import LoginR from "./pages/LoginR";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Property from "./pages/Property";
import Forgot from "./pages/Forgot";
import PropertyDetails from "./pages/PropertyDetails";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Dashboard from "./pages/Dashboard";
import SavedProperties from "./pages/SavedProperties";
import AccountSettings from "./pages/AccountSettings";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import MyProperties from "./pages/MyProperties";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProperty from "./pages/AddProperty";
import TourRequests from "./pages/TourRequests";
import ListingRequest from "./pages/ListingRequest";
import UserManagement from "./pages/UserManagement";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        style={{
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "400px",
        }}
        toastStyle={{ fontSize: "14px" }}
      />
      <ScrollToTop />
      <ScrollToTopButton />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginR />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/properties" element={<Property />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tour-requests" element={<TourRequests />} />
        <Route
          path="/listing-requests"
          element={
            <ProtectedRoute adminOnly={true}>
              <ListingRequest />
            </ProtectedRoute>
          }
        />
        {/* PROTECTED USER ROUTES */}
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-properties"
          element={
            <ProtectedRoute>
              <SavedProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-properties"
          element={
            <ProtectedRoute adminOnly={true}>
              <MyProperties />
            </ProtectedRoute>
          }
        />

        {/*  ADMIN ONLY ROUTE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <ProtectedRoute adminOnly={true}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-property"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="*"
          element={<h1 className="text-center mt-20">404 - Page Not Found</h1>}
        />
      </Routes>
    </>
  );
}

export default App;
