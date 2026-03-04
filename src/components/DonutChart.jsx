import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DonutChart.css'

// Etiquetas legibles para cada categoría de gasto
const ETIQUETAS = {
  comida: 'Comida',
  transporte: 'Transporte',
  entretenimiento: 'Entretenimiento',
  salud: 'Salud',
  otros: 'Otros',
}

// Color fijo por categoría para consistencia visual
const COLORES = {
  comida: '#f85149',
  transporte: '#58a6ff',
  entretenimiento: '#bc8cff',
  salud: '#3fb950',
  otros: '#e3b341',
}

// Agrupa los gastos por categoría y ordena de mayor a menor
function procesarDatos(transacciones) {
  const porCategoria = {}
  transacciones
    .filter(t => t.type === 'expense')
    .forEach(t => {
      porCategoria[t.category] = (porCategoria[t.category] || 0) + t.amount
    })

  return Object.entries(porCategoria)
    .map(([cat, valor]) => ({
      name: ETIQUETAS[cat] || cat,
      value: Math.round(valor * 100) / 100,
      color: COLORES[cat] || '#8b949e',
    }))
    .sort((a, b) => b.value - a.value)
}

// Estilo del tooltip
const estiloTooltip = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#e6edf3',
  fontSize: '0.85rem',
}

// Etiqueta de porcentaje dentro de cada segmento (omite los muy pequeños)
function RenderizarEtiqueta({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const RADIAN = Math.PI / 180
  const radio = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radio * Math.cos(-midAngle * RADIAN)
  const y = cy + radio * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function ExpenseDonutChart({ transacciones }) {
  const datos = procesarDatos(transacciones)

  if (datos.length === 0) {
    return (
      <div className="donut-vacio">
        <span className="donut-vacio-icono">📊</span>
        <p>No hay gastos registrados aún</p>
      </div>
    )
  }

  return (
    <div className="donut-container">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={datos}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={RenderizarEtiqueta}
          >
            {datos.map((entrada, idx) => (
              <Cell key={`cell-${idx}`} fill={entrada.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={estiloTooltip}
            formatter={(value) => [
              `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
              '',
            ]}
          />
          <Legend
            wrapperStyle={{ color: '#8b949e', fontSize: '0.82rem', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseDonutChart
