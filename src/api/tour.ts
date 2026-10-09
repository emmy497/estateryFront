
import api from "./api";

// const BASE_URL = "http://localhost:5009/api/tours";

export const createTour = (data: any, token: string) =>
  api.post("/tours", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTours = (token: string) =>
  api.get("/tours", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTour = (id: string, data: any, token: string) =>
  api.put(`/tours/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
