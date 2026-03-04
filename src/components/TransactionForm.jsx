import { useState } from 'react'
import './TransactionForm.css'

const CATEGORIAS_GASTO = [
  { value: 'comida', label: 'Comida' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'entretenimiento', label: 'Entretenimiento' },
  { value: 'salud', label: 'Salud' },
  { value: 'otros', label: 'Otros' },
]

const CATEGORIAS_INGRESO = [
  { value: 'salario', label: 'Salario' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'otros', label: 'Otros' },
]

// Devuelve la fecha de hoy en formato YYYY-MM-DD
function getFechaHoy() {
  return new Date().toISOString().split('T')[0]
}

const FORM_INICIAL = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'comida',
  date: getFechaHoy(),
}

function TransactionForm({ onAgregar }) {
  const [form, setForm] = useState(FORM_INICIAL)
  const [exito, setExito] = useState(false)

  // Categorías disponibles según el tipo seleccionado
  const categorias = form.type === 'expense' ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'type') {
      // Reiniciar categoría al cambiar el tipo para evitar valores inválidos
      const categoriaDefecto = value === 'expense' ? 'comida' : 'salario'
      setForm(prev => ({ ...prev, type: value, category: categoriaDefecto }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const monto = parseFloat(form.amount)
    if (!monto || monto <= 0 || !form.description.trim()) return

    onAgregar({
      id: crypto.randomUUID(),
      description: form.description.trim(),
      amount: monto,
      type: form.type,
      category: form.category,
      date: form.date,
    })

    // Resetear el formulario conservando la fecha de hoy
    setForm({ ...FORM_INICIAL, date: getFechaHoy() })

    // Feedback visual de éxito durante 2 segundos
    setExito(true)
    setTimeout(() => setExito(false), 2000)
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="description">Descripción</label>
        <input
          id="description"
          className="form-input"
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ej. Supermercado, Salario mensual..."
          required
          maxLength={100}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Monto</label>
          <input
            id="amount"
            className="form-input"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="type">Tipo</label>
          <select
            id="type"
            className={`form-select form-select--${form.type}`}
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="category">Categoría</label>
          <select
            id="category"
            className="form-select"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">Fecha</label>
          <input
            id="date"
            className="form-input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button className={`form-btn${exito ? ' form-btn--exito' : ''}`} type="submit">
        {exito ? '✓ Transacción agregada' : '+ Agregar Transacción'}
      </button>
    </form>
  )
}

export default TransactionForm
