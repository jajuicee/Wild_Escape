import api from "./authInterceptor";

const userService = {
  updateProfile: (id, payload) =>
    api.put(`/api/users/${id}`, payload),

  getReviewCount: (userId) =>
  api.get(`/api/users/${userId}/reviews/count`)

};

export default userService;
