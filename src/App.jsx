import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import MonthlyBarChart from './components/BarChart'
import ExpenseDonutChart from './components/DonutChart'
import TransactionList from './components/TransactionList'
import './App.css'

const CLAVE_STORAGE = 'finanzas_transacciones'

// Datos de muestra para los últimos 6 meses (oct 2025 – mar 2026)
const DATOS_MUESTRA = [
  // Marzo 2026 (mes actual)
  { id: 'sm-01', description: 'Salario marzo', amount: 3500, type: 'income', category: 'salario', date: '2026-03-01' },
  { id: 'sm-02', description: 'Supermercado', amount: 120, type: 'expense', category: 'comida', date: '2026-03-02' },
  { id: 'sm-03', description: 'Metro', amount: 30, type: 'expense', category: 'transporte', date: '2026-03-03' },
  // Febrero 2026
  { id: 'sf-01', description: 'Salario febrero', amount: 3500, type: 'income', category: 'salario', date: '2026-02-01' },
  { id: 'sf-02', description: 'Proyecto freelance', amount: 600, type: 'income', category: 'freelance', date: '2026-02-15' },
  { id: 'sf-03', description: 'Supermercado', amount: 350, type: 'expense', category: 'comida', date: '2026-02-05' },
  { id: 'sf-04', description: 'Gasolina', amount: 80, type: 'expense', category: 'transporte', date: '2026-02-10' },
  { id: 'sf-05', description: 'Cine y salidas', amount: 90, type: 'expense', category: 'entretenimiento', date: '2026-02-14' },
  { id: 'sf-06', description: 'Consulta médica', amount: 150, type: 'expense', category: 'salud', date: '2026-02-20' },
  // Enero 2026
  { id: 'se-01', description: 'Salario enero', amount: 3500, type: 'income', category: 'salario', date: '2026-01-01' },
  { id: 'se-02', description: 'Restaurantes', amount: 280, type: 'expense', category: 'comida', date: '2026-01-08' },
  { id: 'se-03', description: 'Transporte público', amount: 60, type: 'expense', category: 'transporte', date: '2026-01-03' },
  { id: 'se-04', description: 'Streaming', amount: 30, type: 'expense', category: 'entretenimiento', date: '2026-01-10' },
  { id: 'se-05', description: 'Ropa invierno', amount: 180, type: 'expense', category: 'otros', date: '2026-01-15' },
  // Diciembre 2025
  { id: 'sd-01', description: 'Salario diciembre', amount: 3500, type: 'income', category: 'salario', date: '2025-12-01' },
  { id: 'sd-02', description: 'Bono navideño', amount: 1200, type: 'income', category: 'otros', date: '2025-12-20' },
  { id: 'sd-03', description: 'Cena navideña', amount: 200, type: 'expense', category: 'comida', date: '2025-12-24' },
  { id: 'sd-04', description: 'Regalos navidad', amount: 450, type: 'expense', category: 'entretenimiento', date: '2025-12-22' },
  { id: 'sd-05', description: 'Viaje fin de año', amount: 800, type: 'expense', category: 'entretenimiento', date: '2025-12-27' },
  { id: 'sd-06', description: 'Supermercado', amount: 180, type: 'expense', category: 'comida', date: '2025-12-10' },
  // Noviembre 2025
  { id: 'sn-01', description: 'Salario noviembre', amount: 3500, type: 'income', category: 'salario', date: '2025-11-01' },
  { id: 'sn-02', description: 'Supermercado', amount: 320, type: 'expense', category: 'comida', date: '2025-11-10' },
  { id: 'sn-03', description: 'Gasolina', amount: 90, type: 'expense', category: 'transporte', date: '2025-11-05' },
  { id: 'sn-04', description: 'Farmacia', amount: 65, type: 'expense', category: 'salud', date: '2025-11-18' },
  { id: 'sn-05', description: 'Concierto', amount: 110, type: 'expense', category: 'entretenimiento', date: '2025-11-25' },
  // Octubre 2025
  { id: 'so-01', description: 'Salario octubre', amount: 3500, type: 'income', category: 'salario', date: '2025-10-01' },
  { id: 'so-02', description: 'Proyecto web', amount: 900, type: 'income', category: 'freelance', date: '2025-10-15' },
  { id: 'so-03', description: 'Supermercado', amount: 290, type: 'expense', category: 'comida', date: '2025-10-07' },
  { id: 'so-04', description: 'Transporte público', amount: 60, type: 'expense', category: 'transporte', date: '2025-10-03' },
  { id: 'so-05', description: 'Concierto', amount: 120, type: 'expense', category: 'entretenimiento', date: '2025-10-20' },
  { id: 'so-06', description: 'Medicamentos', amount: 45, type: 'expense', category: 'salud', date: '2025-10-12' },
]

function App() {
  const [transacciones, setTransacciones] = useState(() => {
    try {
      const guardadas = localStorage.getItem(CLAVE_STORAGE)
      return guardadas ? JSON.parse(guardadas) : DATOS_MUESTRA
    } catch {
      return DATOS_MUESTRA
    }
  })

  // Persistir en localStorage cada vez que cambia el estado
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(transacciones))
  }, [transacciones])

  const agregarTransaccion = (transaccion) => {
    setTransacciones(prev => [transaccion, ...prev])
  }

  const eliminarTransaccion = (id) => {
    setTransacciones(prev => prev.filter(t => t.id !== id))
  }

  const editarTransaccion = (id, nuevaDescripcion) => {
    if (!nuevaDescripcion.trim()) {
      eliminarTransaccion(id)
    } else {
      setTransacciones(prev =>
        prev.map(t => t.id === id ? { ...t, description: nuevaDescripcion.trim() } : t)
      )
    }
  }

  const editarMonto = (id, nuevoMonto) => {
    const monto = parseFloat(nuevoMonto)
    if (!nuevoMonto || isNaN(monto) || monto <= 0) {
      eliminarTransaccion(id)
    } else {
      setTransacciones(prev =>
        prev.map(t => t.id === id ? { ...t, amount: monto } : t)
      )
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">💰 Finanzas Personales</h1>
        <p className="app-subtitle">Control de ingresos y gastos</p>
      </header>

      <main className="app-main">
        <Dashboard transacciones={transacciones} />

        <div className="app-grid">
          <div className="app-card">
            <h2 className="card-title">Nueva Transacción</h2>
            <TransactionForm onAgregar={agregarTransaccion} />
          </div>
          <div className="app-card">
            <h2 className="card-title">Ingresos vs Gastos — Últimos 6 meses</h2>
            <MonthlyBarChart transacciones={transacciones} />
          </div>
        </div>

        <div className="app-grid app-grid--bottom">
          <div className="app-card">
            <h2 className="card-title">Gastos por Categoría</h2>
            <ExpenseDonutChart transacciones={transacciones} />
          </div>
          <div className="app-card">
            <h2 className="card-title">Historial de Transacciones</h2>
            <TransactionList transacciones={transacciones} onEliminar={eliminarTransaccion} onEditar={editarTransaccion} onEditarMonto={editarMonto} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
