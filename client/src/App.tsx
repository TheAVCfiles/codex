import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PortalNavigation from "./components/PortalNavigation";
import PortalFooter from "./components/PortalFooter";
import PricingSection from "./components/PricingSection";
import FounderDashboard from "./pages/FounderDashboard";
import FounderOnboardingFlow from "./pages/FounderOnboardingFlow";
import StartupStudios from "./pages/StartupStudios";
import KineticLedger from "./pages/KineticLedger";
import FounderOSSandbox from "./pages/FounderOSSandbox";
import Contracts from "./pages/Contracts";

function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{title}</h1>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PortalNavigation />
      <Routes>
        <Route path="/" element={<PricingSection />} />
        <Route path="/kinetic-ledger" element={<KineticLedger />} />
        <Route path="/founderos/sandbox" element={<FounderOSSandbox />} />
        <Route path="/founder" element={<FounderDashboard />} />
        <Route path="/founder/onboarding" element={<FounderOnboardingFlow />} />
        <Route path="/startup-studios" element={<StartupStudios />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/governance" element={<Placeholder title="Governance" />} />
        <Route path="/tokens" element={<Placeholder title="Tokens" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <PortalFooter />
    </BrowserRouter>
  );
}
