import axios from "axios";
import type { MonthlySnapshot } from "../types";

const API_URL = "https://localhost:7219/api/snapshots";

// Função simples para obter o token e formatar o Header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getSnapshots = async (): Promise<MonthlySnapshot[]> => {
  const response = await axios.get<MonthlySnapshot[]>(API_URL, getAuthHeader());
  return response.data;
};

export const saveSnapshot = async (snapshot: MonthlySnapshot): Promise<MonthlySnapshot> => {
  // Nota: No POST/PUT, o Header é o 3º argumento
  const response = await axios.post<MonthlySnapshot>(API_URL, snapshot, getAuthHeader());
  return response.data;
};

export const updateSnapshot = async (id: number, snapshot: MonthlySnapshot): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, snapshot, getAuthHeader());
};

export const deleteSnapshot = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeader());
};