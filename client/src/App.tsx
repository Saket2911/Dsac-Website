import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import DailyQuestion from "@/pages/DailyQuestion";
import Contests from "@/pages/Contests";
import Quests from "@/pages/Quests";
import Events from "@/pages/Events";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import AboutDSAC from "@/pages/AboutDSAC";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={AboutDSAC} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/daily" component={DailyQuestion} />
          <Route path="/contests" component={Contests} />
          <Route path="/quests" component={Quests} />
          <Route path="/events" component={Events} />
          <Route path="/resources" component={Resources} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
