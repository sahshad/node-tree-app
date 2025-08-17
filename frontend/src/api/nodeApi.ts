import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api/node/" });

export const fetchRootNodes = (page = 1, limit = 5) =>
  API.get(`/roots?page=${page}&limit=${limit}`);

export const fetchChildNodes = (id: string, page = 1, limit = 5) =>
  API.get(`/${id}/children?page=${page}&limit=${limit}`);

export const createNode = (data: { name: string; parentId?: string }) =>
  API.post("/", data);

export const updateNode = (id: string, data: { name: string }) =>
  API.patch(`/${id}`, data);

export const deleteNode = (id: string) => API.delete(`/${id}`);
