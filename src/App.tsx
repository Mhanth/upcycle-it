import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NavBar from "@/components/ui/NavBar";
import Landing from "./pages/Landing";
import Scanner from "./pages/Scanner";
import Community from "./pages/Community";
import Facilities from "./pages/Facilities";
import MyLog from "./pages/MyLog";
import Auth from "./pages/Auth";
import CarbonWallet from "./pages/CarbonWallet";
import OrgDashboard from "./pages/OrgDashboard";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/community" element={<Community />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/log" element={<MyLog />} />
            <Route path="/wallet" element={<CarbonWallet />} />
            <Route path="/org" element={<OrgDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NavBar />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
