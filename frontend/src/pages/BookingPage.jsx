import BookingHeader from "../components/BookingHeader";
import BookingContent from "../components/BookingContent";

const BookingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ====================== Hero Section ====================== */}
      <BookingHeader />

      {/* ====================== Booking Content Section ====================== */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-0 py-16">
        {/* Directly render BookingContent without any extra box */}
        <BookingContent />
      </section>

      {/* ====================== Extra spacing for bottom ====================== */}
      <div className="h-16 md:h-32"></div>
    </div>
  );
};

export default BookingPage;
