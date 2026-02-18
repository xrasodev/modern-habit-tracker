import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import LoadingScreen from "./components/layout/LoadingScreen";

// Lazy-loaded components for better bundle size
const LoginPage = lazy(() => import("./pages/LoginPage"));
const GridDays = lazy(() => import("./pages/HistoryPage"));
const SetupPage = lazy(() => import("./pages/SetupPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));

const App: React.FC = () => {
  const { userId, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingScreen message="Verificando sesión de usuario..." />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen message="Cargando aplicaciones..." />}>
        <Routes>
          <Route
            path="/login"
            element={!userId ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={userId ? <MainLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<GridDays />} />
            <Route path="day/:date" element={<GridDays />} />
            <Route path="day/*" element={<Navigate to="/" replace />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="setup" element={<SetupPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
