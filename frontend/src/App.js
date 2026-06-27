import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home";
import Aboutpage from "./pages/Aboutpage";
import Programspage from "./pages/Programspage";
import Impactpage from "./pages/Impactpage";
import Leadershippage from "./pages/Leadershippage";
import Articlespage from "./pages/Articlespage";
import Articledetail from "./pages/Articledetail";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import Contactpage from "./pages/Contactpage";
import Programdetail from "./pages/Programdetail";
import Newspage from "./pages/Newspage";
import Getinvolvedpage from "./pages/Getinvolvedpage";
import ProgramAdmin from "./pages/ProgramAdmin";
import ImpactAdmin from "./pages/ImpactAdmin";
import OpportunitiesAdminPage from "./pages/OpportunitiesAdminPage";

import Hero from "./components/Hero";
import Admin from "./components/Admin";
import EventAdmin from "./components/EventAdmin";
import ArticleAdmin from "./components/ArticleAdmin";
import LeadershipAdmin from "./components/LeadershipAdmin";
import LoginPage from "./pages/LoginPage";
import { ScrollProvider } from "./components/ScrollContext";
import PrivateRoute from "./components/PrivateRoute";
import WelcomePage from "./pages/WelcomePage";
import "./App.css";
import GalleryPage from "./pages/GalleryPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="font-sans">
      <ScrollProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<Home />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/programs" element={<Programspage />} />
            <Route path="/impact" element={<Impactpage />} />
            <Route path="/leadership" element={<Leadershippage />} />
            <Route path="/articles" element={<Articlespage />} />
            <Route path="/articles/:id" element={<Articledetail />} />
            <Route path="/tenders" element={<OpportunitiesPage />} />
            <Route path="/contact" element={<Contactpage />} />
            <Route path="/programs/:pillar/:slug" element={<Programdetail />} />
            <Route path="/news" element={<Newspage />} />
            <Route path="/get-involved" element={<Getinvolvedpage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/admin-login" element={<LoginPage />} />
            <Route path="/gallery/:id" element={<GalleryPage />} />

            {/* ── Protected admin routes ── */}
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/event-admin" element={<PrivateRoute><EventAdmin /></PrivateRoute>} />
            <Route path="/leaders-admin" element={<PrivateRoute><LeadershipAdmin /></PrivateRoute>} />
            <Route path="/program-admin" element={<PrivateRoute><ProgramAdmin /></PrivateRoute>} />
            <Route path="/impact-admin" element={<PrivateRoute><ImpactAdmin /></PrivateRoute>} />
            <Route path="/article-admin" element={<PrivateRoute><ArticleAdmin /></PrivateRoute>} />
            <Route path="/opportunities-admin" element={<PrivateRoute><OpportunitiesAdminPage /></PrivateRoute>} />
          </Routes>
        </Router>
      </ScrollProvider>
    </div>
  );
}

export default App;