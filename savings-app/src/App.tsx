import { useState, useEffect } from "react";
import MonthlyTable from "./components/MonthlyTable";
import SavingsForm from "./components/SavingsForm";
import { getSnapshots, deleteSnapshot } from "./Services/SnapshotService";
import type { MonthlySnapshot } from "./types";
import Login from "./components/Login";

function App() {
  // Inicializa o estado diretamente do localStorage para evitar desfasamento no refresh
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [view, setView] = useState<"investimentos" | "dashboard2">("investimentos");
  const [showForm, setShowForm] = useState(false);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(false); // Começa como false para não bloquear o Login
  const [editingSnapshot, setEditingSnapshot] = useState<MonthlySnapshot | null>(null);

  // Função para carregar dados da API
  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getSnapshots();
      // Ordenação por data
      const sortedData = data.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
      setSnapshots(sortedData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      // Se o JWT expirar (Erro 401), forçamos logout
      if ((error as any).response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar dados sempre que o token mudar ou o componente montar
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Isto dispara o useEffect e muda o ecrã instantaneamente
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setSnapshots([]);
  };

  const handleEdit = (snapshot: MonthlySnapshot) => {
    setEditingSnapshot(snapshot);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja eliminar este registo?")) return;
    try {
      await deleteSnapshot(id);
      setSnapshots((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao eliminar:", error);
      alert("Erro ao eliminar o registo.");
    }
  };

  // Cálculo seguro do património para evitar "ecrã preto/vazio"
  const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const totalPatrimonio = lastSnapshot
    ? (Number(lastSnapshot.techEtf || 0) + 
       Number(lastSnapshot.sp500 || 0) + 
       Number(lastSnapshot.safetyFund || 0) + 
       Number(lastSnapshot.checkingAccount || 0))
    : 0;

  // 1. CONDICIONAL DE LOGIN: Se não há token, mostra APENAS o componente de Login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. RENDERIZAÇÃO DA APP: Se chegou aqui, é porque o token existe
  return (
    <div className="is-preload">
      <div id="wrapper" className="fade-in">
        <header id="header">
          <a href="#" className="logo">Gestão Financeira</a>
        </header>

        <nav id="nav">
          <ul className="links">
            <li className={view === "investimentos" ? "active" : ""}>
              <a onClick={() => { setView("investimentos"); setShowForm(false); }} style={{ cursor: "pointer" }}>
                Investimentos
              </a>
            </li>
            <li className={view === "dashboard2" ? "active" : ""}>
              <a onClick={() => setView("dashboard2")} style={{ cursor: "pointer" }}>
                Empresa
              </a>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: "pointer", color: "#f56a6a" }}>
                Sair
              </a>
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
                    <button className="button primary" onClick={() => setShowForm(true)}>
                      Adicionar Registro
                    </button>
                  </div>

                  {loading && snapshots.length === 0 ? (
                    <p>A carregar dados do servidor...</p>
                  ) : (
                    <MonthlyTable 
                      data={snapshots} 
                      onDelete={handleDelete} 
                      onEdit={handleEdit} 
                    />
                  )}
                </>
              )}
            </section>
          )}
          
          {view === "dashboard2" && (
            <section className="post">
              <header className="major">
                <h2>Dados da Empresa</h2>
                <p>Área em desenvolvimento.</p>
              </header>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;