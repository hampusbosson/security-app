import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "@/config/paths";
import ProtectedRoute from "./routes/protected-route";
import PublicRoute from "./routes/public-route";
import LandingPage from "@/app/routes/landing";
import DashboardPage from "@/app/routes/app/dashboard";
import NotFoundPage from "@/app/routes/not-found";
import SignupPage from "./routes/auth/signup";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={paths.landing.home.path}
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path={paths.auth.signup.path}
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path={paths.app.dashboard.path}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
