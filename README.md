# Shop 502 — TUI Carrito de Compras

POC de una TUI (Text User Interface) para el manejo del carrito de usuarios anónimos de la plataforma de E-Commerce **Shop 502**.

## Integrantes del grupo

| Integrante | Objetivo |
|------------|----------|
| Jose (Josero31) | Objetivo 1 — Herramientas de agentic coding |
| *(por asignar)* | Objetivo 2A — Setup de repo y branch protection |
| *(por asignar)* | Objetivo 2B — Lógica del carrito + unit tests (TDD) |
| *(por asignar)* | Objetivo 2C — TUI + integration tests |
| *(por asignar)* | Objetivo 2D — CI/CD pipelines |

## Demo de la interfaz

```
| Por favor ingrese su nombre.
> Rodrigo Custodio
| Hola Rodrigo! ¿Qué deseas modificar en tu carrito?
> 12345 5
| Tu carrito es:
|   - 12345 con 5 unidades
| ¿Qué más deseas hacer?
> 12345 -5
| Tu carrito está vacío, que más deseas hacer?
> 12345 -5
| Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?
> 456 29
| Tu carrito es:
|   - 456 con 29 unidades
| ¿Qué más deseas hacer?
> bye
| Adiós fue un gusto atenderte!
```

**Formato de comando:** `<id_producto> <cantidad>` — cantidad positiva suma, negativa resta.

## Cómo correr

> Nota: este repositorio aún no incluye `package.json` ni los scripts necesarios; estas instrucciones aplicarán cuando se agregue la implementación.

    # Requisitos: Node.js >= 18, pnpm
    pnpm install
    pnpm start

## Tests

```bash
pnpm test          # corre Jest con reporte de cobertura
```

Cobertura mínima requerida: **80 %** (líneas, funciones, branches, statements).

## Build

```bash
pnpm build         # genera binarios standalone en dist/
```

## Flujo de trabajo

Este proyecto sigue **GitHub Flow**:

- Todas las ramas parten de `main` con prefijo `feature/`, `fix/` o `chore/`.
- Los cambios a `main` requieren Pull Request con al menos 1 revisión de un compañero que no sea el autor.
- La pipeline de CI corre los tests automáticamente en cada PR y en cada push a `main`.
- La pipeline de CD publica el binario en GitHub Artifacts al mergear a `main`.
- Push directo a `main` está bloqueado por branch protection rules.

## Herramienta de agentic coding

Se utilizó **Claude Code** (Anthropic) durante el desarrollo. *(Pendiente)* Se agregará `docs/agentic-workflow.md` con la evidencia detallada: prompts utilizados, qué generó la IA y qué se editó manualmente.

Para convenciones del proyecto y reglas para agentes de código ver [AGENTS.md](AGENTS.md).

## Licencia

MIT
