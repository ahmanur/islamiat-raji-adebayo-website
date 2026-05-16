import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ResearchPage } from '@/pages/ResearchPage';
import { PublicationsPage } from '@/pages/PublicationsPage';
import { MentorshipPage } from '@/pages/MentorshipPage';
import { OutreachPage } from '@/pages/OutreachPage';
import { OutreachEngagementPage } from '@/pages/OutreachEngagementPage';
import { FieldWorkPage } from '@/pages/FieldWorkPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { TeachingPage } from '@/pages/TeachingPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { ResearchThemePage } from '@/pages/ResearchThemePage';
import NotFound from '@/pages/not-found';

import { AdminAuthProvider, useAdminAuth } from '@/lib/adminAuth';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminHero } from '@/pages/admin/AdminHero';
import { AdminAbout } from '@/pages/admin/AdminAbout';
import { AdminResearch } from '@/pages/admin/AdminResearch';
import { AdminPublications } from '@/pages/admin/AdminPublications';
import { AdminNews } from '@/pages/admin/AdminNews';
import { AdminMentorship } from '@/pages/admin/AdminMentorship';
import { AdminOutreach } from '@/pages/admin/AdminOutreach';
import { AdminOutreachEngagement } from '@/pages/admin/AdminOutreachEngagement';
import { AdminFieldWork } from '@/pages/admin/AdminFieldWork';
import { AdminOpportunities } from '@/pages/admin/AdminOpportunities';
import { AdminTeaching } from '@/pages/admin/AdminTeaching';
import { AdminMedia } from '@/pages/admin/AdminMedia';
import { AdminNavigation } from '@/pages/admin/AdminNavigation';
import { AdminSettings } from '@/pages/admin/AdminSettings';

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { session, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    );
  }
  if (!session) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Admin routes — no public Navbar/Footer */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
        <Route path="/admin/hero" component={() => <ProtectedRoute component={AdminHero} />} />
        <Route path="/admin/about" component={() => <ProtectedRoute component={AdminAbout} />} />
        <Route path="/admin/research" component={() => <ProtectedRoute component={AdminResearch} />} />
        <Route path="/admin/publications" component={() => <ProtectedRoute component={AdminPublications} />} />
        <Route path="/admin/fieldwork" component={() => <ProtectedRoute component={AdminFieldWork} />} />
        <Route path="/admin/news" component={() => <ProtectedRoute component={AdminNews} />} />
        <Route path="/admin/mentorship" component={() => <ProtectedRoute component={AdminMentorship} />} />
        <Route path="/admin/teaching" component={() => <ProtectedRoute component={AdminTeaching} />} />
        <Route path="/admin/contact-info" component={() => <ProtectedRoute component={AdminOutreach} />} />
        <Route path="/admin/outreach" component={() => <ProtectedRoute component={AdminOutreachEngagement} />} />
        <Route path="/admin/opportunities" component={() => <ProtectedRoute component={AdminOpportunities} />} />
        <Route path="/admin/media" component={() => <ProtectedRoute component={AdminMedia} />} />
        <Route path="/admin/navigation" component={() => <ProtectedRoute component={AdminNavigation} />} />
        <Route path="/admin/settings" component={() => <ProtectedRoute component={AdminSettings} />} />

        {/* Public site routes */}
        <Route>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/research/theme/:slug" component={ResearchThemePage} />
                <Route path="/research/:id" component={ProjectDetailPage} />
                <Route path="/research" component={ResearchPage} />
                <Route path="/publications" component={PublicationsPage} />
                <Route path="/mentorship" component={MentorshipPage} />
                <Route path="/teaching" component={TeachingPage} />
                <Route path="/news" component={OutreachPage} />
                <Route path="/outreach" component={OutreachEngagementPage} />
                <Route path="/field-work" component={FieldWorkPage} />
                <Route path="/opportunities" component={OpportunitiesPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AdminAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </AdminAuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
