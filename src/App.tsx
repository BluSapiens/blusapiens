import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Ga4PageTracker from "@/components/analytics/Ga4PageTracker";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Process from "./pages/Process";
import CaseStudies from "./pages/CaseStudies";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Tools from "./pages/Tools";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminResources from "./pages/admin/AdminResources";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const BlogEditorPage = lazy(() => import("@/blog/editor/BlogEditorPage"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Ga4PageTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/process" element={<Process />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route
              path="blog/new"
              element={
                <Suspense fallback={<div className="px-6 py-10">Loading editor...</div>}>
                  <BlogEditorPage />
                </Suspense>
              }
            />
            <Route
              path="blog/:postId"
              element={
                <Suspense fallback={<div className="px-6 py-10">Loading editor...</div>}>
                  <BlogEditorPage />
                </Suspense>
              }
            />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
