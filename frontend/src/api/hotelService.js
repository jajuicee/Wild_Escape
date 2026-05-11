import api from "./authInterceptor";

const hotelService = {
  getAllHotels: () => api.get("/api/hotels"),
};

export default hotelService;