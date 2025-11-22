import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "@/config/paths";
import ProtectedRoute from "./routes/protected-route";
import PublicRoute from "./routes/public-route";
import LandingPage from "@/app/routes/landing";
import DashboardPage from "@/app/routes/app/dashboard";
import NotFoundPage from "@/app/routes/not-found";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import DashboardSettingsPage from "@/app/routes/app/settings";
import RepositoriesPage from "./routes/app/repositories";
import FindingsPage from "./routes/app/findings";
import PullRequestsPage from "./routes/app/pull-requests";
import TrendsPage from "./routes/app/trends";
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
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path={paths.app.repositories.path}
            element={<RepositoriesPage />}
          />
          <Route path={paths.app.findings.path} element={<FindingsPage />} />
          <Route
            path={paths.app.pullRequests.path}
            element={<PullRequestsPage />}
          />
          <Route path={paths.app.trends.path} element={<TrendsPage />} />
          <Route
            path={paths.app.settings.path}
            element={<DashboardSettingsPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
