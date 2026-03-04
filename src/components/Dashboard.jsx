import './Dashboard.css'

// Formatea un número como moneda MXN
const formatearMoneda = (monto) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto)

// Obtiene la clave del mes actual en formato YYYY-MM
function getMesActual() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
}

function Dashboard({ transacciones }) {
  const mesActual = getMesActual()
  const txsMes = transacciones.filter(t => t.date.startsWith(mesActual))

  const ingresosMes = txsMes
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const gastosMes = txsMes
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIngresos = transacciones
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalGastos = transacciones
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIngresos - totalGastos

  return (
    <div className="dashboard">
      {/* Tarjeta de balance total */}
      <div className={`summary-card summary-card--balance ${balance >= 0 ? 'positivo' : 'negativo'}`}>
        <span className="summary-icon">💼</span>
        <div className="summary-info">
          <span className="summary-label">Balance Total</span>
          <span className={`summary-amount ${balance >= 0 ? 'monto-positivo' : 'monto-negativo'}`}>
            {formatearMoneda(balance)}
          </span>
        </div>
      </div>

      {/* Tarjeta de ingresos del mes */}
      <div className="summary-card summary-card--income">
        <span className="summary-icon">📈</span>
        <div className="summary-info">
          <span className="summary-label">Ingresos del Mes</span>
          <span className="summary-amount monto-ingreso">{formatearMoneda(ingresosMes)}</span>
        </div>
      </div>

      {/* Tarjeta de gastos del mes */}
      <div className="summary-card summary-card--expense">
        <span className="summary-icon">📉</span>
        <div className="summary-info">
          <span className="summary-label">Gastos del Mes</span>
          <span className="summary-amount monto-gasto">{formatearMoneda(gastosMes)}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
