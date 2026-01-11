import type { MonthlySnapshot } from "../Models/MonthlySnapshot.ts";

interface Props {
  data: MonthlySnapshot[];
}

function monthName(month: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return months[month - 1];
}

function MonthlyTable({ data }: Props) {
  
  // Função para renderizar a diferença em relação ao mês anterior
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

  // Função para renderizar o valor investido (o campo novo que pediu)
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
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const prevRow = data[index - 1];

            return (
              <tr key={`${row.year}-${row.month}`} style={{ borderBottom: '1px solid #f4f4f4' }}>
                <td style={{ padding: '12px 8px' }}>
                  <strong>{monthName(row.month)}</strong> <br/>
                  <small style={{ color: '#999' }}>{row.year}</small>
                </td>
                
                {/* Tech ETF */}
                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.techEtf.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.techEtfInvested)} {/* Campo solicitado */}
                  {renderDiff(row.techEtf, prevRow?.techEtf)}
                </td>

                {/* S&P 500 */}
                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.sp500.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.sp500Invested)}
                  {renderDiff(row.sp500, prevRow?.sp500)}
                </td>

                {/* Fundo Segurança */}
                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.safetyFund.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.safetyFundInvested)}
                  {renderDiff(row.safetyFund, prevRow?.safetyFund)}
                </td>

                {/* Conta Corrente */}
                <td style={{ padding: '12px 8px' }}>
                  <strong>{row.checkingAccount.toLocaleString('pt-PT')}</strong>
                  {renderInvested(row.checkingAccountInvested)}
                  {renderDiff(row.checkingAccount, prevRow?.checkingAccount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MonthlyTable;