import React from "react";
import { Route, Switch } from "wouter";
import FounderDashboard from "./pages/FounderDashboard";
import FounderOnboardingFlow from "./pages/FounderOnboardingFlow";
import StartupStudios from "./pages/StartupStudios";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/founder" component={FounderDashboard} />
      <Route path="/founder/onboarding" component={FounderOnboardingFlow} />
      <Route path="/startup-studios" component={StartupStudios} />
    </Switch>
  );
}
