import type { MonthlySnapshot } from "../types";

interface Props {
  data: MonthlySnapshot[];
  onDelete: (id: number) => void;
  onEdit: (snapshot: MonthlySnapshot) => void; // 1. Adiciona aqui
}

// 1. Mantemos a função auxiliar fora do componente para ficar limpo
function monthName(month: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return months[month - 1];
}

const MonthlyTable = ({ data, onDelete, onEdit }: Props) => {

  // 2. Função para o clique de apagar
  const handleDeleteClick = (id: number) => {
    if (window.confirm("Tens a certeza que queres eliminar este registo?")) {
      onDelete(id);
    }
  };

  // 3. Tuas funções de renderização (mantidas exatamente como tinhas)
  const renderDiff = (current: number, previous: number | undefined) => {
    if (previous === undefined) return <div style={{ color: '#888', fontSize: '0.75rem' }}>-</div>;
    const diff = current - previous;
    const color = diff >= 0 ? '#28a745' : '#dc3545';
    const sign = diff >= 0 ? '+' : '';
    
    return (
      <div style={{ color, fontSize: '0.75rem', fontWeight: 'bold' }}>
        {sign}{diff.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} (Variação)
      </div>
    );
  };

  const renderInvested = (value: number | undefined) => {
    return (
      <div style={{ color: '#555', fontSize: '0.8rem', fontStyle: 'italic' }}>
        Inv: {value ? value.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '0,00'}
      </div>
    );
  };

  return (
    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Mês</th>
            <th>Tech ETF</th>
            <th>S&P 500</th>
            <th>Fundo Segurança</th>
            <th>Conta Corrente</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const prevRow = data[index - 1];

            return (
              <tr key={row.id || `${row.year}-${row.month}`} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <td style={{ padding: '12px 8px' }}>
                  <strong>{monthName(row.month)}</strong> <br/>
                  <small style={{ color: '#999' }}>{row.year}</small>
                </td>
                
                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.techEtf.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.techEtfInv)}
                  {renderDiff(row.techEtf, prevRow?.techEtf)}
                </td>

                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.sp500.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.sp500Inv)}
                  {renderDiff(row.sp500, prevRow?.sp500)}
                </td>

                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.safetyFund.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.safetyFundInv)}
                  {renderDiff(row.safetyFund, prevRow?.safetyFund)}
                </td>

                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.checkingAccount.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.checkingAccountInv)}
                  {renderDiff(row.checkingAccount, prevRow?.checkingAccount)}
                </td>

                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <button 
                    className="button small icon solid fa-pencil-alt" // Ícone de lápis do template
                    style={{ 
                      boxShadow: 'none', 
                      height: '2.5rem', 
                      lineHeight: '2.5rem',
                      padding: '0 1rem',
                      display: 'inline-flex', // Adicionado para alinhar ícone e texto
                      alignItems: 'center',
                      gap: '8px',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                      }}
                    onClick={() => onEdit(row)} // Precisamos de passar o objeto todo para editar
                      >
                  </button>
                  <button 
                    className="button primary small" // Removi as classes "icon solid fa-times" daqui
                    style={{ 
                      boxShadow: 'none', 
                      height: '2.5rem', 
                      lineHeight: '2.5rem',
                      padding: '0 1rem',
                      display: 'inline-flex', // Adicionado para alinhar ícone e texto
                      alignItems: 'center',
                      gap: '8px',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => row.id && handleDeleteClick(row.id)}
>
                    {/* O ÍCONE ENTRA AQUI COMO UMA TAG À PARTE */}
                    <i className="fa-solid fa-xmark"></i> 
                    </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; // Fechamos o componente apenas uma vez aqui

export default MonthlyTable;