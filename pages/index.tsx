import Router from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Modal from '@/components/Modal';
import LoginForm from './users/login/login-form';
import toast from 'react-hot-toast';
import { features, userStatement } from '../config/constant';
import { ChevronRight } from 'lucide-react';

export default function Home() {

  const user = useSelector((state: RootState) => state.auth.user);
  const [showLogin, setShowLogin] = useState(false);
  console.log("user", user)

  const handleFeatureClick = (path?: string) => {
    if (!user?.id) {
      toast.error('Please login to continue.');
      setShowLogin(true);
      return;
    }
    if (path) {
      Router.push(path);
    }
  };

  return (
    <>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onLoginSuccess={() => setShowLogin(false)} />
      </Modal>
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 px-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl shadow-md mx-0 md:mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-4xl font-bold leading-snug">
          Empower Your Financial & Fitness Journey
        </h2>
        <p className="mt-3 text-base md:text-lg max-w-xl mx-auto">
          Track expenses, split bills, manage your diet, and achieve fitness goals — all in one app.
        </p>
        <button className="mt-6 md:mt-8 bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-base md:text-lg hover:bg-gray-200 transition">
          Get Started for Free
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-0">

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700">Why Choose Fit Finance?</h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative px-5 py-5 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500 cursor-pointer"
              onClick={() => handleFeatureClick(feature.path)}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-blue-600">{feature.title}</h3>
              <p className="mt-1 text-gray-600 hidden sm:block text-sm">{feature.desc}</p>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 block sm:hidden">
                <ChevronRight size={20} className="text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <style jsx>{`
          @keyframes scrollCards {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>

      <section id="testimonials" className="py-16 bg-blue-50 px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-700 leading-snug px-4">
          What Our Users Say
        </h2>

        {/* Mobile View: Horizontal Scroll + Animate */}
        <div className="mt-10 md:hidden overflow-hidden">
          <div className="flex space-x-4 animate-[scrollCards_15s_linear_infinite] px-2" style={{ minWidth: '200%' }}>
            {[...userStatement, ...userStatement].map((testimonial, index) => (
              <div
                key={index}
                className="w-[90vw] max-w-sm flex-shrink-0 text-center p-5 bg-white rounded-lg shadow-md border-t-4 border-blue-500"
              >
                <p className="italic text-gray-700 text-sm">{testimonial.quote}</p>
                <p className="mt-3 font-semibold text-blue-600">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Static Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mt-12">
          {userStatement.map((testimonial, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-500"
            >
              <p className="italic text-gray-700">{testimonial.quote}</p>
              <p className="mt-4 font-semibold text-blue-600">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-16 px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-700 leading-snug px-4">
          We Value Your Feedback
        </h2>
        <form className="mt-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-500">
          <label className="block mb-4">
            <span className="text-gray-700">Your Name</span>
            <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500" placeholder="Enter your name" />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Your Feedback</span>
            <textarea className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500" rows={4} placeholder="Share your experience..." />
          </label>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Submit Feedback</button>
        </form>
      </section>
    </>
  );
}