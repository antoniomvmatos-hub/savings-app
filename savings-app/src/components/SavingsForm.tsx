import { useEffect, useState } from "react";
import type { MonthlySnapshot } from "../types";
import { saveSnapshot } from "../Services/SnapshotService";

interface Props {
  onCancel: () => void;
  onSave: () => void;
  snapshotToEdit: MonthlySnapshot | null; // Adiciona esta linha exatamente assim
}

function SavingsForm({ onSave, onCancel, snapshotToEdit }: Props) {
  // Estado inicial para o mês (mês atual)
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(snapshotToEdit?.year ?? new Date().getFullYear());
  const [id, setId] = useState(0); // Para controlar se é novo (0) ou edição
  
  // Estado único para os valores numéricos
  const [vals, setVals] = useState({
    techEtf: 0, techEtfInv: 0,
    sp500: 0, sp500Inv: 0,
    safetyFund: 0, safetyFundInv: 0,
    checkingAccount: 0, checkingAccountInv: 0
  });

  // --- NOVO: Efeito para preencher o formulário quando for Edição
  useEffect(() => {
    if(snapshotToEdit) {
      setMonth(snapshotToEdit.month);
      setYear(snapshotToEdit.year);
      setId(snapshotToEdit.id || 0);
      setVals({
        techEtf: snapshotToEdit.techEtf,
        techEtfInv: snapshotToEdit.techEtfInv || 0,
        sp500: snapshotToEdit.sp500,
        sp500Inv: snapshotToEdit.sp500Inv || 0,
        safetyFund: snapshotToEdit.safetyFund,
        safetyFundInv: snapshotToEdit.safetyFundInv || 0,
        checkingAccount: snapshotToEdit.checkingAccount,
        checkingAccountInv: snapshotToEdit.checkingAccountInv || 0,
      });
    }
  }, [snapshotToEdit]);


  const handleChange = (field: string, value: string) => {
    // Garantimos que o valor é sempre um número ou 0
    setVals(prev => ({ ...prev, [field]: value === "" ? 0 : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: MonthlySnapshot = {
      ...vals,
      id,
      month,
      year,
    };

    try {
      await saveSnapshot(payload);
      onSave(); // Notifica o App.tsx que deve recarregar os dados e fechar o form
    } catch (err) {
      console.error(err);
      alert("Erro ao comunicar com a API. Verifique se o servidor está ligado.");
    }
  };

  return (
    <section>
      <header className="major">
        <h3>{id ? "Editar Registo" : "Adicionar Novo Registo"}Adicionar Novo Registro</h3>
        <p>Introduza os valores atuais e os montantes investidos para este mês.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className="row gtr-uniform">
          
          {/* SELEÇÃO DO MÊS */}
          <div className="col-12">
            <label htmlFor="month-select">Mês de Referência</label>
            <select 
              id="month-select" 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          {/* CAMPOS DE VALORES */}
          {[
            { id: 'techEtf', label: 'Tech ETF' },
            { id: 'sp500', label: 'S&P 500' },
            { id: 'safetyFund', label: 'Fundo Emergência' },
            { id: 'checkingAccount', label: 'Conta Corrente' }
          ].map(field => (
            <div className="col-6 col-12-xsmall" key={field.id}>
              <label>{field.label}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Valor Atual (€)"
                  value={vals[field.id as keyof typeof vals]}
                  onChange={(e) => handleChange(field.id, e.target.value)} 
                />
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Total Investido (€)"
                  value={vals[`${field.id}Inv` as keyof typeof vals]} // LIGA O VALOR AO ESTADO
                  onChange={(e) => handleChange(`${field.id}Inv`, e.target.value)} 
                />
              </div>
            </div>
          ))}

          {/* BOTÕES DE AÇÃO */}
          <div className="col-12">
            <ul className="actions">
              <li>
                <button type="submit" className="button primary">Guardar Registro</button>
              </li>
              <li>
                <button type="button" className="button" onClick={onCancel}>Cancelar</button>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </section>
  );
}

export default SavingsForm;