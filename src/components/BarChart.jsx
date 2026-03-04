import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './BarChart.css'

// Genera los últimos 6 meses con clave YYYY-MM y etiqueta corta
function getUltimosSeisMeses() {
  const meses = []
  const hoy = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    meses.push({
      clave: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      etiqueta: d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
    })
  }
  return meses
}

// Agrupa las transacciones por mes para los últimos 6 meses
function procesarDatos(transacciones) {
  const meses = getUltimosSeisMeses()
  return meses.map(mes => {
    const txsMes = transacciones.filter(t => t.date.startsWith(mes.clave))
    const ingresos = txsMes
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const gastos = txsMes
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { mes: mes.etiqueta, Ingresos: ingresos, Gastos: gastos }
  })
}

// Estilo del contenedor del tooltip
const estiloTooltip = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#e6edf3',
  fontSize: '0.85rem',
}

// Formatea los valores del eje Y abreviando miles
function formatearEjeY(valor) {
  if (valor === 0) return '$0'
  if (valor >= 1000) return `$${(valor / 1000).toFixed(1)}k`
  return `$${valor}`
}

function MonthlyBarChart({ transacciones }) {
  const datos = procesarDatos(transacciones)

  return (
    <div className="barchart-container">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datos} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fill: '#8b949e', fontSize: 12 }}
            axisLine={{ stroke: '#30363d' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatearEjeY}
            width={55}
          />
          <Tooltip
            contentStyle={estiloTooltip}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value) => [
              `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
              undefined,
            ]}
          />
          <Legend
            wrapperStyle={{ color: '#8b949e', fontSize: '0.82rem', paddingTop: '12px' }}
          />
          <Bar dataKey="Ingresos" fill="#3fb950" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Gastos" fill="#f85149" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyBarChart
