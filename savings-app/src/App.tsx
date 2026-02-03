import { useState, useEffect } from "react";
import MonthlyTable from "./components/MonthlyTable";
import SavingsForm from "./components/SavingsForm";
import { getSnapshots, deleteSnapshot } from "./Services/SnapshotService";
import type { MonthlySnapshot } from "./types";
import Login from "./components/Login";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [view, setView] = useState<"investimentos" | "dashboard2">("investimentos");
  const [showForm, setShowForm] = useState(false);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSnapshot, setEditingSnapshot] = useState<MonthlySnapshot | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setSnapshots([]);
  };

  // Funções que estavam em falta:
  const handleEdit = (snapshot: MonthlySnapshot) => {
    setEditingSnapshot(snapshot);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSnapshot(id);
      setSnapshots((prev) => prev.filter((item) => item.id !== id));
      console.log("Registo eliminado com sucesso!");
    } catch (error) {
      console.error("Erro ao eliminar:", error);
      alert("Erro ao eliminar o registo. Verifica a ligação com a API.");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getSnapshots();
      const sortedData = data.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
      setSnapshots(sortedData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      if ((error as any).response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false); 
    }
  };

  // Se não houver token, mostra o Login
  if (!token) {
    return <Login onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const totalPatrimonio = lastSnapshot
    ? lastSnapshot.techEtf + lastSnapshot.sp500 + lastSnapshot.safetyFund + lastSnapshot.checkingAccount
    : 0;

  return (
    <div className="is-preload">
      <div id="wrapper" className="fade-in">
        <header id="header">
          <a href="#" className="logo">Gestão Financeira</a>
        </header>

        <nav id="nav">
          <ul className="links">
            <li className={view === "investimentos" ? "active" : ""}>
              <a onClick={() => { setView("investimentos"); setShowForm(false); }} style={{ cursor: "pointer" }}>Investimentos</a>
            </li>
            <li className={view === "dashboard2" ? "active" : ""}>
              <a onClick={() => setView("dashboard2")} style={{ cursor: "pointer" }}>Empresa</a>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: "pointer", color: "#f56a6a" }}>Sair</a>
            </li>
          </ul>
        </nav>

        <div id="main">
          {view === "investimentos" && (
            <section className="post">
              <header className="major">
                <h1>Savings Tracker</h1>
                <p>Evolução do património protegida por JWT</p>
              </header>

              {showForm ? (
                <SavingsForm
                  snapshotToEdit={editingSnapshot}
                  onCancel={() => { setShowForm(false); setEditingSnapshot(null); }}
                  onSave={() => { loadData(); setShowForm(false); setEditingSnapshot(null); }}
                />
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      Total Património: {totalPatrimonio.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                    </span>
                    <button className="button primary" onClick={() => setShowForm(true)}>Adicionar Registro</button>
                  </div>

                  {loading ? (
                    <p>A carregar dados...</p>
                  ) : (
                    <MonthlyTable data={snapshots} onDelete={handleDelete} onEdit={handleEdit} />
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;