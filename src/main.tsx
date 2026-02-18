import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HabitsProvider } from "./context/HabitsProvider";
import { AuthProvider } from "./context/AuthProvider";
import { DemoProvider } from "./demo/DemoProvider";

import { isDemoMode as checkDemoMode } from "./demo/isDemo";

const isDemoMode = checkDemoMode();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isDemoMode ? (
      <DemoProvider>
        <App />
      </DemoProvider>
    ) : (
      <AuthProvider>
        <HabitsProvider>
          <App />
        </HabitsProvider>
      </AuthProvider>
    )}
  </StrictMode>,
);
