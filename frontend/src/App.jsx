import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0f2c] text-white">
      {/* Floating Oval Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 text-black rounded-full shadow-lg px-6 py-3 flex items-center justify-between w-[90%] max-w-5xl z-50">
        {/* Logo */}
        <div className="text-xl font-bold text-white">HelpMeMake</div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-white">
          <a href="#how-it-works" className="hover:text-purple-700 transition-colors">How it Works</a>
          <a href="#mentors" className="hover:text-purple-700 transition-colors">Find Mentors</a>
          <a href="#projects" className="hover:text-purple-700 transition-colors">Projects</a>
          <a href="#pricing" className="hover:text-purple-700 transition-colors">Pricing</a>
        </nav>

        {/* Login / Signup */}
        <div className="space-x-4">
          <button className="text-sm font-medium text-white hover:text-purple-700 transition-colors" onClick={() => navigate('/login')}>
            Login
            </button>
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-800 transition-colors" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Placeholder content */}
      <main className="pt-32 px-6 md:px-12 lg:px-24">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Bring Your Ideas to Life</h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Hire skilled mentors to guide you in building your dream projects. From coding to design, we’ve got you covered.
          </p>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="mt-20">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">How it Works</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-4">📝</span>
              <h3 className="text-xl font-semibold mb-2">Add Skillset & Domain</h3>
              <p className="text-purple-100">Tell us your current skills and the domain you want to build your project in.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-4">🤖</span>
              <h3 className="text-xl font-semibold mb-2">AI Matches Mentors</h3>
              <p className="text-purple-100">Our AI filters and suggests the best mentor profiles for your needs.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-4">💳</span>
              <h3 className="text-xl font-semibold mb-2">Pick & Pay for Mentor</h3>
              <p className="text-purple-100">Choose your mentor and securely pay to start your journey.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-4">💬</span>
              <h3 className="text-xl font-semibold mb-2">Communication & Reminders</h3>
              <p className="text-purple-100">Get a private room for chat and daily reminders to keep you on track.</p>
            </div>
            {/* Card 5 */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <span className="text-4xl mb-4">🛡️</span>
              <h3 className="text-xl font-semibold mb-2">Security & Scrutiny</h3>
              <p className="text-purple-100">We ensure fairness and security, protecting both mentors and learners from cheating.</p>
            </div>
          </div>
        </section>
        <div className="h-[200vh]" /> {/* Simulate scrolling */}
      </main>
    </div>
  );
}
