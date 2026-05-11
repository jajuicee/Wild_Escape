// src/api/uploadService.js
import api from "./authInterceptor";

export function uploadRoomImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/api/uploads/room-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

