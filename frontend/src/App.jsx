import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages//HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="h-screen" data-theme="night">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/call" element={<CallPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>

      <Toaster />
    </div>
  );
};

export default App;
