import api from "./authInterceptor";

export const getConfirmedBookingCount = async (userId) => {
  const res = await api.get(`/api/users/${userId}/confirmed-bookings/count`);
  return res.data.count;
};
