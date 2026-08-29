
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import Flights from "./pages/Flights";
import Visa from "./pages/Visa";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import PlanTrip from "./pages/PlanTrip";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import PackageItinerary from "./pages/PackageItinerary";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id/itinerary" element={<PackageItinerary />} />
          {/* <Route path="/flights" element={<Flights />} /> */}
          <Route path="/visa" element={<Visa />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/my-bookings" element={<MyBookings />} /> */}

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/admin/*" element={<Navigate to="/admin/login" replace />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
