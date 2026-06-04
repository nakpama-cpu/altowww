import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrochureModalProvider } from "@/components/BrochureModal";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import WhyWhisky from "./pages/WhyWhisky.tsx";
import AboutWhisky from "./pages/AboutWhisky.tsx";
import HowWhiskyIsMade from "./pages/HowWhiskyIsMade.tsx";
import FAQ from "./pages/FAQ.tsx";
import Contact from "./pages/Contact.tsx";
import News from "./pages/News.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import NotFound from "./pages/NotFound.tsx";

// Portal
import PortalLogin from "./pages/portal/Login";
import PortalSignup from "./pages/portal/Signup";
import ForgotPassword from "./pages/portal/ForgotPassword";
import ResetPassword from "./pages/portal/ResetPassword";
import PendingApproval from "./pages/portal/PendingApproval";
import PortalLayout from "./pages/portal/PortalLayout";
import Dashboard from "./pages/portal/Dashboard";
import MyCasks from "./pages/portal/MyCasks";
import AvailableStock from "./pages/portal/AvailableStock";
import RequestCallback from "./pages/portal/RequestCallback";
import Account from "./pages/portal/Account";
import PortalNews from "./pages/portal/PortalNews";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminClients from "./pages/admin/Clients";
import AdminCasks from "./pages/admin/Casks";
import AdminHoldings from "./pages/admin/Holdings";
import AdminDistilleries from "./pages/admin/Distilleries";
import AdminCallbacks from "./pages/admin/Callbacks";
import AdminOrders from "./pages/admin/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BrochureModalProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/why-whisky" element={<WhyWhisky />} />
              <Route path="/about-whisky" element={<AboutWhisky />} />
              <Route path="/how-whisky-is-made" element={<HowWhiskyIsMade />} />
              <Route path="/faqs" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<ArticlePage />} />

              {/* Public auth pages */}
              <Route path="/portal/login" element={<PortalLogin />} />
              <Route path="/portal/signup" element={<PortalSignup />} />
              <Route path="/portal/forgot-password" element={<ForgotPassword />} />
              <Route path="/portal/reset-password" element={<ResetPassword />} />
              <Route path="/portal/pending" element={
                <ProtectedRoute><PendingApprovalGuard /></ProtectedRoute>
              } />

              {/* Client portal */}
              <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="my-casks" element={<MyCasks />} />
                <Route path="available" element={<AvailableStock />} />
                <Route path="callback" element={<RequestCallback />} />
                <Route path="account" element={<Account />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminClients />} />
                <Route path="casks" element={<AdminCasks />} />
                <Route path="holdings" element={<AdminHoldings />} />
                <Route path="distilleries" element={<AdminDistilleries />} />
                <Route path="callbacks" element={<AdminCallbacks />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrochureModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// PendingApproval is reached when user is signed in but not approved; render directly.
const PendingApprovalGuard = () => <PendingApproval />;

export default App;
