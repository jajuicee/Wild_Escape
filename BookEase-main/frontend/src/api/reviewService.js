import api from "./authInterceptor";
import publicApi from "./publicApi";

const reviewService = {
  // ✅ PUBLIC
  getHotelReviews: (hotelId) => 
    publicApi.get(`/api/reviews/hotel/${hotelId}`),

  getHotelRatingSummary: (hotelId) =>
    publicApi.get(`/api/reviews/hotel/${hotelId}/rating-summary`),

  getAllReviews: () =>
    publicApi.get(`/api/reviews`),

  // 🔒 AUTH REQUIRED
  canWriteReview: (hotelId) => 
    api.get(`/api/bookings/can-review/${hotelId}`),

  getReviewableHotels: () =>
    api.get("/api/bookings/can-review"),

  createReview: (payload) => 
    api.post("/api/reviews", payload),

  updateReview: (id, payload) => 
    api.put(`/api/reviews/${id}`, payload),

  deleteReview: (id) => 
    api.delete(`/api/reviews/${id}`),

  getReviewsByUser: (id) =>
    api.get(`/api/reviews/user/${id}`),

  hasCompletedBooking: () =>
    api.get(`/api/bookings/has-completed-booking`)
};

export default reviewService;
