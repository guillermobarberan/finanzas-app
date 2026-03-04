import { useState, useRef, useEffect } from 'react'
import './TransactionList.css'

// Etiquetas de todas las categorías posibles
const ETIQUETAS_CATEGORIA = {
  comida: 'Comida',
  transporte: 'Transporte',
  entretenimiento: 'Entretenimiento',
  salud: 'Salud',
  salario: 'Salario',
  freelance: 'Freelance',
  otros: 'Otros',
}

// Convierte YYYY-MM-DD a formato legible en español
function formatearFecha(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const fecha = new Date(year, month - 1, day)
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Formatea un monto como moneda MXN
const formatearMoneda = (monto) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto)

function TransactionList({ transacciones, onEliminar, onEditar, onEditarMonto }) {
  // Estado de edición de descripción
  const [editandoId, setEditandoId] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')
  const inputEditRef = useRef(null)

  // Estado de edición de monto
  const [editandoMontoId, setEditandoMontoId] = useState(null)
  const [valorMonto, setValorMonto] = useState('')
  const inputMontoRef = useRef(null)

  // Estado de filtros
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [filtroDesde, setFiltroDesde] = useState('')
  const [filtroHasta, setFiltroHasta] = useState('')
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [errorPeriodo, setErrorPeriodo] = useState('')

  // Enfocar y seleccionar al entrar en modo edición de descripción
  useEffect(() => {
    if (editandoId && inputEditRef.current) {
      inputEditRef.current.focus()
      inputEditRef.current.select()
    }
  }, [editandoId])

  // Enfocar y seleccionar al entrar en modo edición de monto
  useEffect(() => {
    if (editandoMontoId && inputMontoRef.current) {
      inputMontoRef.current.focus()
      inputMontoRef.current.select()
    }
  }, [editandoMontoId])

  // Inicia edición de descripción (cancela edición de monto si estaba activa)
  const iniciarEdicion = (t) => {
    setEditandoMontoId(null)
    setValorMonto('')
    setEditandoId(t.id)
    setTextoEdicion(t.description)
  }

  // Inicia edición de monto (cancela edición de descripción si estaba activa)
  const iniciarEdicionMonto = (t) => {
    setEditandoId(null)
    setTextoEdicion('')
    setEditandoMontoId(t.id)
    setValorMonto(String(t.amount))
  }

  // Confirma y guarda (o elimina si vacío)
  const confirmarEdicion = () => {
    if (!editandoId) return
    onEditar(editandoId, textoEdicion)
    setEditandoId(null)
    setTextoEdicion('')
  }

  const manejarTeclaEdicion = (e) => {
    if (e.key === 'Enter') confirmarEdicion()
    if (e.key === 'Escape') {
      setEditandoId(null)
      setTextoEdicion('')
    }
  }

  // Confirma y guarda el monto editado (o elimina si vacío/inválido)
  const confirmarEdicionMonto = () => {
    if (!editandoMontoId) return
    onEditarMonto(editandoMontoId, valorMonto)
    setEditandoMontoId(null)
    setValorMonto('')
  }

  const manejarTeclaEdicionMonto = (e) => {
    if (e.key === 'Enter') confirmarEdicionMonto()
    if (e.key === 'Escape') {
      setEditandoMontoId(null)
      setValorMonto('')
    }
  }

  // Aplica el filtro de período al hacer clic en Buscar
  const manejarBuscarPeriodo = () => {
    if (desde && hasta && desde > hasta) {
      setErrorPeriodo('La fecha "Desde" debe ser anterior o igual a "Hasta"')
      return
    }
    setErrorPeriodo('')
    setFiltroDesde(desde)
    setFiltroHasta(hasta)
  }

  // Limpia todos los filtros
  const limpiarFiltros = () => {
    setDesde('')
    setHasta('')
    setFiltroDesde('')
    setFiltroHasta('')
    setErrorPeriodo('')
    setTextoBusqueda('')
  }

  // Filtros combinados: período activo + descripción en tiempo real
  const transaccionesFiltradas = transacciones.filter(t => {
    if (filtroDesde && t.date < filtroDesde) return false
    if (filtroHasta && t.date > filtroHasta) return false
    if (textoBusqueda.trim() &&
      !t.description.toLowerCase().includes(textoBusqueda.toLowerCase().trim())) return false
    return true
  })

  const hayFiltrosActivos = filtroDesde || filtroHasta || textoBusqueda.trim()

  // Sin transacciones en absoluto
  if (transacciones.length === 0) {
    return (
      <div className="lista-vacia">
        <span className="lista-vacia-icono">📋</span>
        <p>No hay transacciones registradas</p>
        <p className="lista-vacia-sub">Agrega tu primera transacción usando el formulario</p>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      {/* Panel de filtros */}
      <div className="filtros-panel">
        {/* Filtro por descripción (tiempo real) */}
        <input
          type="text"
          className="filtro-input filtro-input--texto"
          placeholder="Buscar por descripción..."
          value={textoBusqueda}
          onChange={e => setTextoBusqueda(e.target.value)}
        />

        {/* Filtro por período */}
        <div className="filtro-periodo-fila">
          <div className="filtro-fecha-grupo">
            <label className="filtro-label">Desde</label>
            <input
              type="date"
              className="filtro-input filtro-input--fecha"
              value={desde}
              max={hasta || undefined}
              onChange={e => {
                setDesde(e.target.value)
                setErrorPeriodo('')
              }}
            />
          </div>
          <div className="filtro-fecha-grupo">
            <label className="filtro-label">Hasta</label>
            <input
              type="date"
              className="filtro-input filtro-input--fecha"
              value={hasta}
              min={desde || undefined}
              onChange={e => {
                setHasta(e.target.value)
                setErrorPeriodo('')
              }}
            />
          </div>
          <button className="btn-buscar" onClick={manejarBuscarPeriodo}>
            Buscar
          </button>
          {hayFiltrosActivos && (
            <button className="btn-limpiar" onClick={limpiarFiltros} title="Limpiar filtros">
              ✕
            </button>
          )}
        </div>

        {errorPeriodo && <p className="filtro-error">{errorPeriodo}</p>}
      </div>

      {/* Lista de transacciones filtradas */}
      {transaccionesFiltradas.length === 0 ? (
        <div className="lista-vacia">
          <span className="lista-vacia-icono">🔍</span>
          <p>No hay resultados en el período indicado</p>
          <p className="lista-vacia-sub">Intenta con otros filtros o limpia la búsqueda</p>
        </div>
      ) : (
        <div className="list-scroll">
          {transaccionesFiltradas.map(t => (
            <div key={t.id} className={`transaction-item transaction-item--${t.type}`}>
              {/* Indicador de color por tipo */}
              <div className="transaction-indicator" />

              <div className="transaction-info">
                {/* Modo edición o visualización */}
                {editandoId === t.id ? (
                  <input
                    ref={inputEditRef}
                    className="input-edicion"
                    value={textoEdicion}
                    onChange={e => setTextoEdicion(e.target.value)}
                    onBlur={confirmarEdicion}
                    onKeyDown={manejarTeclaEdicion}
                  />
                ) : (
                  <span
                    className="transaction-description"
                    onDoubleClick={() => iniciarEdicion(t)}
                    title="Doble clic para editar"
                  >
                    {t.description}
                  </span>
                )}
                <span className="transaction-meta">
                  <span className="transaction-category">
                    {ETIQUETAS_CATEGORIA[t.category] || t.category}
                  </span>
                  <span className="transaction-date">{formatearFecha(t.date)}</span>
                </span>
              </div>

              <div className="transaction-right">
                {editandoMontoId === t.id ? (
                  <input
                    ref={inputMontoRef}
                    type="number"
                    className="input-edicion-monto"
                    value={valorMonto}
                    min="0.01"
                    step="0.01"
                    onChange={e => setValorMonto(e.target.value)}
                    onBlur={confirmarEdicionMonto}
                    onKeyDown={manejarTeclaEdicionMonto}
                  />
                ) : (
                  <span
                    className={`transaction-amount ${t.type === 'income' ? 'monto-ingreso' : 'monto-gasto'}`}
                    onDoubleClick={() => iniciarEdicionMonto(t)}
                    title="Doble clic para editar monto"
                  >
                    {t.type === 'income' ? '+' : '-'}{formatearMoneda(t.amount)}
                  </span>
                )}
                <button
                  className="btn-eliminar"
                  onClick={() => onEliminar(t.id)}
                  title="Eliminar transacción"
                  aria-label="Eliminar transacción"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionList
