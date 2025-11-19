import type React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "@/config/paths";
import LandingPage from "@/app/routes/landing";
import DashboardPage from "@/app/routes/app/dashboard";
import NotFoundPage from "@/app/routes/not-found";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.landing.home.path} element={<LandingPage />} />
        <Route path={paths.app.dashboard.path} element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
