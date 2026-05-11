import React from "react";

const BookingHero = () => {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 md:px-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&h=900&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
        Booking Made <span className="text-blue-400">Easy</span>, <br />
        <span className="text-blue-400">Travel</span> Made Smarter
      </h1>
      <p className="text-lg md:text-xl text-white mb-8 opacity-90">
        Your Journey, Just One Click Away. Find the best deals worldwide.
      </p>
    </div>
  );
};

export default BookingHero;
