# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Finanzas App

Aplicación de finanzas personales construida con React 18 + Vite.

## Comandos de desarrollo

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (localhost:5173)
npm run build      # build de producción
npm run preview    # previsualizar build de producción
```

## Stack

- React 18 + Vite
- CSS modular por componente (sin Tailwind)
- Recharts para gráficas (única librería de UI permitida)

## Reglas de código

- Siempre usar componentes funcionales con hooks
- Nombres de componentes en PascalCase
- Nombres de archivos CSS iguales al componente: `WeatherCard.css`
- Variables CSS globales en `index.css`, nunca valores hardcodeados en componentes
- Comentarios en español

## Estructura de carpetas

```
src/
├── components/   ← un .jsx y un .css por componente
├── assets/
├── App.jsx
└── index.css
```

## Lo que NO hacer

- No usar inline styles
- No instalar librerías sin preguntar primero
- No modificar `index.html` ni `main.jsx` salvo que se indique explícitamente
