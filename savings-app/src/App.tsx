import { useState, useEffect } from "react";
import MonthlyTable from "./components/MonthlyTable";
import SavingsForm from "./components/SavingsForm";
import { getSnapshots, deleteSnapshot } from "./Services/SnapshotService";
import type { MonthlySnapshot } from "./types";

function App() {
  const [view, setView] = useState<"investimentos" | "dashboard2">("investimentos");
  const [showForm, setShowForm] = useState(false);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSnapshot, setEditingSnapshot] = useState<MonthlySnapshot | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getSnapshots();
      // Ordenar por ano e mês para a tabela fazer sentido
      const sortedData = data.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
      setSnapshots(sortedData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length-1] : null;
  const totalPatrimonio = lastSnapshot
    ? (lastSnapshot.techEtf + lastSnapshot.sp500 + lastSnapshot.safetyFund + lastSnapshot.checkingAccount)
    : 0;

  const handleEdit = (snapshot: MonthlySnapshot) => {
      setEditingSnapshot(snapshot);
      setShowForm(true); // Abre o formulário que já usas para o "Adicionar"
  };

const handleDelete = async (id: number) => {
  try {
    // 1. Chamamos a função do Service (que usa a porta 7219 correta)
    await deleteSnapshot(id);
    // 2. Se a API respondeu OK, removemos da lista visual
    setSnapshots(prev => prev.filter(item => item.id !== id));
    console.log("Registo eliminado com sucesso!");
  } catch (error) {
    console.error("Erro ao eliminar:", error);
    alert("Erro: A API não respondeu na porta 7219. Verifica se o Visual Studio está a correr o projeto.");
  }
};

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="is-preload">
      <div id="wrapper" className="fade-in">
        <header id="header">
          <a href="#" className="logo">Gestão Financeira</a>
        </header>

        <nav id="nav">
          <ul className="links">
            <li className={view === "investimentos" ? "active" : ""}>
              <a onClick={() => { setView("investimentos"); setShowForm(false); }} style={{ cursor: 'pointer' }}>Investimentos</a>
            </li>
            <li className={view === "dashboard2" ? "active" : ""}>
              <a onClick={() => setView("dashboard2")} style={{ cursor: 'pointer' }}>Empresa</a>
            </li>
          </ul>
        </nav>

        <div id="main">
          {view === "investimentos" && (
            <section className="post">
              <header className="major">
                <h1>Savings Tracker</h1>
                <p>Evolução do património vinda da API. teste para deploy</p>
              </header>

              {showForm ? (
                <SavingsForm 
                  snapshotToEdit={editingSnapshot} // Passa o estado de edição para o formulário
                  onCancel={() => {
                    setShowForm(false);
                    setEditingSnapshot(null); // Limpa ao cancelar
                  }} 
                  onSave={() => {
                    loadData(); 
                    setShowForm(false);
                    setEditingSnapshot(null); // Limpa ao salvar
                  }}  
                />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}> 
                      Total Património: {totalPatrimonio}
                    </span>
                    <button className="button primary" onClick={() => setShowForm(true)}>Adicionar Registro</button>
                  </div>
                  
                  {loading ? <p>A carregar dados...</p> : <MonthlyTable data={snapshots} onDelete={handleDelete} onEdit={handleEdit}/>}
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