import React from "react";
import "./main.css";

import Hero from "./pages/Hero";
import HowItWorks from "./pages/HowItWorks";
import MentorPage from "./pages/MentorPage";
import LiveCollabPage from "./pages/LiveCollabPage";
import SafePayments from "./pages/SafePayments";
import UseCases from "./pages/UseCases";
import FinalCTA from "./pages/FinalCTA";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />

      <section id="hero">
        <Hero />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="mentors">
        <MentorPage />
      </section>

      <section id="live-collab">
        <LiveCollabPage />
      </section>

      <section id="safe-payments">
        <SafePayments />
      </section>

      <section id="use-cases">
        <UseCases />
      </section>

      <section id="final-cta">
        <FinalCTA />
      </section>

      <Footer />
    </div>
  );
};

export default App;
