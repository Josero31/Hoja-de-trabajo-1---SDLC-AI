# AGENTS.md

## Sobre el proyecto

POC de TUI (Text User Interface) para el carrito de compras anónimo de **Shop 502** — plataforma de E-Commerce.  
El objetivo es demostrar la gestión de un carrito desde la terminal: agregar, reducir y eliminar productos mediante comandos de texto.

## Cómo correr

```bash
# Instalar dependencias
pnpm install

# Ejecutar la TUI
pnpm start

# Correr tests con cobertura
pnpm test

# Build de binario standalone
pnpm build
```

## Estructura objetivo del proyecto

> Nota: la estructura listada abajo es el objetivo del proyecto y puede no existir todavía en el repositorio.

~~~
/
├── AGENTS.md                          # Este archivo
├── README.md                          # Documentación del proyecto
├── docs/
│   └── agentic-workflow.md            # Evidencia del uso de IA (Claude Code)
├── src/
│   ├── cart.js                        # Lógica pura del carrito
│   └── tui.js                         # Loop de interacción (TUI)
├── tests/
│   ├── cart.test.js                   # Unit tests del carrito
│   └── tui.test.js                    # Tests de la capa TUI
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # Tests en PR y push a main
│   │   └── cd.yml                     # Build + publicar binario a GitHub Artifacts
│   └── pull_request_template.md
├── package.json
└── .gitignore
~~~

## Convenciones de código

- **Lenguaje:** JavaScript (Node.js ≥ 18)
- **Package manager:** pnpm (no usar npm ni yarn)
- **Test runner:** Jest
- **Cobertura mínima:** 80 % de líneas, funciones, branches y statements
- **Estilo:** `'use strict'` en todos los archivos; CommonJS (`require` / `module.exports`)
- **Nomenclatura:** camelCase para variables y funciones; PascalCase para clases
- **Módulos:** lógica de negocio separada de I/O — `cart.js` no importa `readline`

## Flujo de trabajo (GitHub Flow)

1. Partir siempre de `main` actualizado.
2. Crear rama con prefijo `feature/`, `fix/` o `chore/` (ej. `feature/add-product`).
3. Abrir Pull Request hacia `main`; requiere **al menos 1 review** de un compañero que no sea el autor.
4. La pipeline de CI corre automáticamente en cada PR — no se puede mergear si falla.
5. Al mergear a `main` la pipeline de CD publica el binario en GitHub Artifacts.
6. **No se permite push directo a `main`** (rama protegida por branch protection rules).

## Reglas para agentes de código (Claude Code, Codex, OpenCode, etc.)

- **No modificar `main` directamente.** Siempre trabajar en una rama `feature/*` o equivalente.
- **Generar tests junto con cualquier cambio de lógica.** Si se modifica `src/cart.js`, actualizar `tests/cart.test.js` en el mismo commit/PR.
- **Respetar la estructura de carpetas.** Lógica en `src/`, tests en `tests/`, documentación en `docs/`.
- **Mensajes de commit descriptivos** en español o inglés, usando el patrón:  
  `<tipo>: <descripción corta>`  
  Tipos válidos: `feat`, `fix`, `test`, `refactor`, `docs`, `ci`, `chore`.
- **No reducir la cobertura de tests.** Cada cambio debe mantener o mejorar el porcentaje de cobertura.
- **No instalar dependencias nuevas** sin discutirlo con el equipo (afecta la cadena de suministro de software).
- **Al revisar PRs asistidos por IA:** verificar que los asserts en los tests sean significativos, no solo `toBeTruthy()` genéricos.

## Casos de prueba mínimos que los agentes deben cubrir

Cualquier agente que genere o modifique tests debe asegurarse de cubrir al menos:

| # | Caso |
|---|------|
| 1 | Alta de producto nuevo |
| 2 | Alta que incrementa un producto existente |
| 3 | Baja parcial (quedan unidades > 0) |
| 4 | Baja total (llega a 0 → se elimina del carrito) |
| 5 | Baja de producto inexistente → error, sin crash |
| 6 | Carrito vacío al inicio |
| 7 | Múltiples productos formateados correctamente |
| 8 | Comando `bye` con carrito vacío y con productos |
| 9 | Input malformado (sin cantidad, cantidad no numérica) → sin crash |

## Contexto de dominio (para generación de código)

El formato de entrada del usuario es `<id_producto> <cantidad>` separado por espacio:

- `12345 5` → agrega 5 unidades del producto `12345`
- `12345 -5` → resta 5 unidades; si llega a 0 se elimina del carrito
- `bye` → termina la sesión

Mensajes esperados (ver mock en README para el formato exacto con pipes `|`):

- Carrito con productos → listar cada producto
- Carrito vacío tras operación → `"Tu carrito está vacío, que más deseas hacer?"`
- Producto inexistente al restar → `"Oops parece que no tienes el producto X agregado a tu carrito."`
- Despedida → `"Adiós fue un gusto atenderte!"`
