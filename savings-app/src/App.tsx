import { useState, useEffect } from "react";
import MonthlyTable from "./components/MonthlyTable";
import SavingsForm from "./components/SavingsForm";
import { getSnapshots } from "./Services/SnapshotService";
import type { MonthlySnapshot } from "./types";

function App() {
  const [view, setView] = useState<"investimentos" | "dashboard2">("investimentos");
  const [showForm, setShowForm] = useState(false);
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(true);

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
                  onCancel={() => setShowForm(false)} 
                  onSave={() => {
                    loadData(); 
                    setShowForm(false);
                  }} 
                />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                    <button className="button primary" onClick={() => setShowForm(true)}>Adicionar Registro</button>
                  </div>
                  
                  {loading ? <p>A carregar dados...</p> : <MonthlyTable data={snapshots} />}
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