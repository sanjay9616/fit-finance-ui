import Router from 'next/router';
import React from 'react';

export default function Home() {

  const handleFeatureClick = (path?: string) => {
    if (path) {
      Router.push(path);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h2 className="text-4xl font-bold">Empower Your Financial & Fitness Journey</h2>
        <p className="mt-4 text-lg">
          Track expenses, split bills, manage your diet, and achieve fitness goals — all in one app.
        </p>
        <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-gray-200 transition">Get Started for Free</button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700">Why Choose Fit Finance?</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mt-12">
          {[
            { title: "Expense Tracking", desc: "Easily categorize and monitor your expenses in real time.", path: "/expense-tracking" },
            { title: "Diet Management", desc: "Track your daily nutrition intake, manage meals, and stay fit.", path: "/diet-management" },
            { title: "Expense Goal Setting", desc: "Set goals, track progress, and achieve with Fit Finance." },
            { title: "Health Monitoring", desc: "Track body measurements, monitor heart rate, and analyze your overall health progress." },
            { title: "Split Expenses", desc: "Easily divide expenses among friends or family members." },
            { title: "Financial Reports", desc: "Generate detailed reports to analyze your spending and savings." },
            { title: "Workout Plans", desc: "Create and customize your own workout routines and monitor your fitness journey." },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-500 cursor-pointer"
              onClick={() => handleFeatureClick(feature.path)}>
              <h3 className="text-xl font-semibold text-blue-600">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-blue-50 px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700">What Our Users Say</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            { quote: "Tracking my expenses has never been easier! Fit Finance helped me budget effectively and save more.", name: "Sarah Williams" },
            { quote: "Splitting expenses with friends on trips was a hassle before. Fit Finance made it seamless!", name: "Michael Lee" },
            { quote: "The diet and workout management features are incredible. Staying fit and organized has never been so simple.", name: "Priya Sharma" }
          ].map((testimonial, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-500">
              <p className="italic text-gray-700">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold text-blue-600">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700">We Value Your Feedback</h2>
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