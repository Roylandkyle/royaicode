import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CommandCenter from "./pages/CommandCenter";
import SecretLab from "./pages/SecretLab";
import { useState } from "react";

function Router({ isSandboxMode }: { isSandboxMode: boolean }) {
  return (
    <Switch>
      <Route path={"/"} component={() => <CommandCenter />} />
      <Route path={"/secret-lab"} component={() => <SecretLab />} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router isSandboxMode={isSandboxMode} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
