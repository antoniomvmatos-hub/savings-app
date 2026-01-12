import type { MonthlySnapshot } from "../types";

const API_URL = "https://localhost:7219/api/snapshots";

export const getSnapshots = async (): Promise<MonthlySnapshot[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erro ao buscar snapshots");
  return res.json();
};

export const saveSnapshot = async (snapshot: MonthlySnapshot): Promise<MonthlySnapshot> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(snapshot),
  });

  if (!res.ok) throw new Error("Erro ao salvar snapshot");
  return res.json();
};

// --- ADICIONA ESTA FUNÇÃO ---
export const deleteSnapshot = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Erro ao eliminar snapshot");
};