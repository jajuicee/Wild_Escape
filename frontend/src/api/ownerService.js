// src/api/ownerService.js
import api from "./authInterceptor";

const ownerService = {
  // ---------------------
  // 🔵 HOTELS
  // ---------------------
  getMyHotels: () => api.get("/api/owner/hotels"),

  createHotel: (data) => api.post("/api/owner/hotels", data),

  updateHotel: (hotelId, data) => api.put(`/api/owner/hotels/${hotelId}`, data),

  deleteHotel: (hotelId) => api.delete(`/api/owner/hotels/${hotelId}`),

  // ---------------------
  // 🟢 ROOMS
  // ---------------------
  getMyRooms: () => api.get("/api/owner/rooms"),

  createRoom: (hotelId, data) => api.post(`/api/owner/rooms/${hotelId}`, data),

  updateRoom: (roomId, data) => api.put(`/api/owner/rooms/${roomId}`, data),

  deleteRoom: (roomId) => api.delete(`/api/owner/rooms/${roomId}`),

  // ---------------------
  // 🟣 PRICE OFFERS
  // ---------------------
  getMyOffers: () => api.get("/api/owner/offers"),

  createOffer: (roomId, data) => api.post(`/api/owner/offers/${roomId}`, data),

  deleteOffer: (offerId) => api.delete(`/api/owner/offers/${offerId}`),

  updateOffer: (offerId, payload) =>
    api.put(`/api/owner/offers/${offerId}`, payload),

  // ---------------------
  // 🔴 BOOKINGS
  // ---------------------
  getMyBookings: () => api.get("/api/owner/bookings"),

  // ---------------------
  // 🔵 DASHBOARD
  // ---------------------
  getDashboardSummary: () => api.get("/api/owner/dashboard")
};

export default ownerService;
