import { Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "@/store/useStore";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Contractors } from "@/pages/Contractors";
import { OnboardWizard } from "@/pages/OnboardWizard";
import { Systems } from "@/pages/Systems";

function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="onboard" element={<OnboardWizard />} />
          <Route path="systems" element={<Systems />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StoreProvider>
  );
}

export default App;
