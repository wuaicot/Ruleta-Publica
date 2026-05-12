# Proyecto Ruleta Pública - Guía de Desarrollo

Este documento detalla la arquitectura, convenciones y flujos de trabajo del proyecto **Ruleta-publica**.

## 🏗️ Arquitectura del Sistema

El proyecto es una aplicación multijugador en tiempo real que utiliza un modelo **Cliente-Servidor**.

- **Frontend (`/client`):** Aplicación SPA construida con React, TypeScript y MobX. Utiliza Babylon.js para la representación 3D de la ruleta.
- **Backend (`/server`):** Servidor Node.js con Express y Socket.io para la comunicación bidireccional.
- **Shared (`/common`):** Contiene tipos e interfaces de TypeScript y utilidades lógicas compartidas entre cliente y servidor.

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript (estrictamente tipado).
- **Frontend:**
  - **Framework:** React 18.
  - **Estado:** MobX (`gameStore.tsx`).
  - **3D Engine:** Babylon.js (`react-babylonjs`).
  - **Comunicación:** Socket.io-client.
  - **Interacción:** react-dnd (Drag and Drop para las fichas).
- **Backend:**
  - **Servidor:** Express.
  - **Tiempo Real:** Socket.io.
  - **Temporizador:** easytimer.js.

## 🔄 Ciclo de Vida del Juego (Game Loop)

El servidor dicta el estado global del juego, el cual se sincroniza con todos los clientes cada segundo.

1.  **`PLACE_BET` (Haga su apuesta):** Duración ~24s. Los jugadores pueden colocar fichas en el tablero.
2.  **`NO_MORE_BETS` (No va más):** Duración ~3s. Se bloquean las interacciones en el cliente.
3.  **`SPIN_WHEEL` (Girar ruleta):** Duración ~12s. El servidor genera el número ganador y el cliente inicia la animación de la bola.
4.  **`WINNER` (Ganador):** Duración ~10s. Se muestran los resultados y se actualizan los balances.
5.  **`EMPTY_BOARD` (Limpiar tablero):** Reseteo visual y lógico para la siguiente ronda.

## 📏 Convenciones de Desarrollo

### General
- **Tipado:** Siempre utilizar las interfaces definidas en `common/types.ts`.
- **Lógica de Juego:** Cualquier cálculo de premios o validación de apuestas DEBE residir en el servidor o en `common/utils.ts`.

### Frontend
- **Estado Global:** Evitar el uso de `useState` para datos compartidos; utilizar `gameStore` de MobX.
- **Componentes 3D:** Separar la lógica de animación (`RouletteAnimate.tsx`) de la definición de mallas (`RouletteMesh.tsx`).
- **Sincronización:** El hook `useServer.ts` es el único punto de entrada para la comunicación con el servidor.

### Backend
- **Eventos:** Utilizar el objeto `EVENTS` definido en `server/utils.ts` para evitar strings mágicos en las comunicaciones de socket.
- **Persistencia Temporal:** El servidor mantiene los datos de los usuarios conectados en memoria (`usersData`).

## 📁 Estructura de Archivos Clave

- `client/src/store/gameStore.tsx`: Fuente de verdad del estado del frontend.
- `client/src/components/babylon/MainScene.tsx`: Orquestador de la escena 3D y cámaras.
- `server/server.ts`: Punto de entrada del servidor y lógica del temporizador.
- `server/utils.ts`: Funciones de cálculo de premios y gestión de eventos.
- `common/types.ts`: Contratos de datos compartidos.

## 🚀 Comandos Rápidos

### Instalación
```bash
# En la raíz
npm install
cd client && npm install
cd ../server && npm install
```

### Ejecución
- **Backend:** `cd server && npm start` (Corre en el puerto 8888 por defecto).
- **Frontend:** `cd client && npm start` (Corre en el puerto 3000).
