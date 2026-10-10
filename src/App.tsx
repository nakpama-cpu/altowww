import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound.tsx";

const MARKETING_SITE = "https://www.altowhisky.com";
const MARKETING_PATHS = ["/how-it-works", "/why-whisky", "/about-whisky", "/how-whisky-is-made", "/faqs", "/contact", "/invest", "/book-a-call", "/news", "/news/:slug"];

// Root and portal entry keep query string and hash when redirecting.
const RedirectKeepingQuery = ({ to }: { to: string }) => {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: to, search, hash }} replace />;
};

// Marketing URLs now live on the public site.
const ToMarketingSite = () => {
  const { pathname, search, hash } = useLocation();
  window.location.replace(`${MARKETING_SITE}${pathname}${search}${hash}`);
  return null;
};

// Portal
import PortalLogin from "./pages/portal/Login";
import PortalSignup from "./pages/portal/Signup";
import ForgotPassword from "./pages/portal/ForgotPassword";
import ResetPassword from "./pages/portal/ResetPassword";
import PendingApproval from "./pages/portal/PendingApproval";
import PortalLayout from "./pages/portal/PortalLayout";
import PortalEntry from "./pages/portal/PortalEntry";
import Dashboard from "./pages/portal/Dashboard";
import MyCasks from "./pages/portal/MyCasks";
import AvailableStock from "./pages/portal/AvailableStock";
import RequestCallback from "./pages/portal/RequestCallback";
import Account from "./pages/portal/Account";
import PortalNews from "./pages/portal/PortalNews";
import Checkout from "./pages/portal/Checkout";
import Orders from "./pages/portal/Orders";
import { CartProvider } from "./contexts/CartContext";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminClients from "./pages/admin/Clients";
import AdminCasks from "./pages/admin/Casks";
import AdminHoldings from "./pages/admin/Holdings";
import AdminDistilleries from "./pages/admin/Distilleries";
import AdminCallbacks from "./pages/admin/Callbacks";
import AdminOrders from "./pages/admin/Orders";
import AdminDiscountCodes from "./pages/admin/DiscountCodes";
import AdminListings from "./pages/admin/Listings";
import AdminStockAlerts from "./pages/admin/StockAlerts";
import AdminVerifications from "./pages/admin/Verifications";
import CheckoutReturn from "./pages/portal/CheckoutReturn";
import AdminInvoices from "./pages/admin/Invoices";
import InvoicePage from "./pages/InvoicePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<RedirectKeepingQuery to="/login" />} />
              <Route path="/login" element={<PortalLogin />} />
              {MARKETING_PATHS.map((p) => <Route key={p} path={p} element={<ToMarketingSite />} />)}

              {/* Public auth pages */}
              <Route path="/portal/login" element={<PortalLogin />} />
              <Route path="/portal/signup" element={<PortalSignup />} />
              <Route path="/portal/forgot-password" element={<ForgotPassword />} />
              <Route path="/portal/reset-password" element={<ResetPassword />} />
              <Route path="/portal/pending" element={<PendingApprovalGuard />} />
              <Route path="/invoice/:token" element={<InvoicePage />} />

              {/* Client portal */}
              <Route path="/portal" element={<PortalEntry />}>
                <Route index element={<Dashboard />} />
                <Route path="my-casks" element={<MyCasks />} />
                <Route path="available" element={<AvailableStock />} />
                <Route path="news" element={<PortalNews />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="checkout/return" element={<CheckoutReturn />} />
                <Route path="orders" element={<Orders />} />
                <Route path="callback" element={<RequestCallback />} />
                <Route path="account" element={<Account />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminClients />} />
                <Route path="verifications" element={<AdminVerifications />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="stock-alerts" element={<AdminStockAlerts />} />
                <Route path="casks" element={<AdminCasks />} />
                <Route path="holdings" element={<AdminHoldings />} />
                <Route path="distilleries" element={<AdminDistilleries />} />
                <Route path="callbacks" element={<AdminCallbacks />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="discount-codes" element={<AdminDiscountCodes />} />
                <Route path="invoices" element={<AdminInvoices />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// PendingApproval is reached when user is signed in but not approved; render directly.
const PendingApprovalGuard = () => <PendingApproval />;

export default App;
