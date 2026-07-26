# Evidencia de uso de agentic coding

Este documento registra el uso de herramientas de agentic coding en el proyecto
(Objetivo 1, Jose / Josero31): **Claude Code** (Anthropic) y **GitHub Copilot**
(agente de código sobre PRs).

## Sesión documentada: auditoría y actualización de documentación

**Fecha:** 2026-07-25
**Rama:** `Jose`
**Herramienta:** Claude Code (CLI), modelo Sonnet 5

### Contexto / prompt del usuario

Se le pidió al agente que cerrara los pendientes señalados en una revisión previa del
repositorio:

1. Completar los marcadores de "pendiente" del README (integrantes, sección de
   agentic workflow, licencia, nota desactualizada sobre `package.json`).
2. Agregar `docs/agentic-workflow.md` con evidencia real de uso de IA.
3. Revisar coherencia entre el README/docs y lo que el código realmente implementa.
4. Verificar que los tests pasan, que se cumple la cobertura mínima de 80 % y que
   `pnpm build` genera los binarios.

### Qué generó/ejecutó el agente

- Cambió a la rama `main` para inspeccionar el estado real del repo (la rama `Jose`
  estaba desactualizada y no reflejaba `package.json`, `LICENSE`, `docs/`, `src/` ni
  `tests/`, que ya existían en `main`).
- Ejecutó `pnpm install`, `pnpm test` (vía `npx pnpm`, ya que `pnpm` no estaba
  instalado globalmente) y confirmó: 3 test suites, 21 tests, todos verdes.
- Leyó `docs/objetivo-2-api.md` y lo comparó línea por línea contra
  `src/cart.js`, `src/parser.js`, `src/session.js`, `src/tui.js` y
  `src/messages.js` — confirmó que el contrato documentado coincide con la
  implementación real (estados de `OperationStatus`, tipos de `CommandType`,
  formato de mensajes, comportamiento de `Session`).
- Identificó, mediante `git log`/`gh pr list`, que todos los commits y PRs de los
  Objetivos 2A–2D fueron autoría de Ángel Mérida (`SaintPage`), y usó esa evidencia
  (confirmada con el usuario) para completar la tabla de integrantes del README.
- Confirmó con `gh run list` que los workflows `CI` y `CD` corrieron exitosamente
  sobre `main` (incluyendo `pnpm build` generando los binarios de `dist/`), dado que
  el build falla localmente en este entorno Windows por una limitación de sandbox al
  invocar el fetch de binarios de `pkg` (no es un problema del proyecto).
- Editó `README.md`: reemplazó los tres marcadores de "pendiente"/desactualizado
  (integrantes, sección de agentic workflow, licencia) y quitó la nota obsoleta sobre
  la ausencia de `package.json`.
- Creó este archivo (`docs/agentic-workflow.md`).

### Qué se editó/decidió manualmente

- La decisión de a quién asignar cada objetivo en la tabla de integrantes se
  confirmó explícitamente con el usuario antes de escribirla (el historial de git
  por sí solo era evidencia suficiente, pero no autoritativa).
- El alcance de este documento (qué contar como "evidencia") también se acordó con
  el usuario: se documenta únicamente lo verificable — de esta sesión, o de historial
  de git/GitHub Actions que se puede confirmar con `git log` y `gh run list` — sin
  inventar prompts o transcripts que no quedaron registrados (los PRs #3-#5 dejaron
  vacía la sección "Uso de herramientas agénticas" de la plantilla).
- Todos los cambios de esta sesión se hicieron sobre la rama `Jose` y se subieron
  como Pull Request hacia `main`, siguiendo el flujo GitHub Flow del proyecto
  (revisión de un compañero antes de mergear).

## Gaps detectados y corregidos

La IA ayudó a detectar errores/huecos en los tests que luego se corrigieron en la
misma sesión: `tui.js` e `index.js` no tenían ningún test, y Jest los excluía del
reporte de cobertura en vez de contarlos como no cubiertos. Se agregó
`tests/tui.test.js` y se configuró `coverageThreshold` (80 %) en `package.json`
para que el umbral se haga cumplir de verdad. `pnpm test` ahora pasa 26/26.

## Sesión previa (Objetivo 2D): GitHub Copilot arregló el CI del PR #6

**Fecha:** 2026-07-25
**PR:** [#6 — ci: pipelines de tests y publicación de binario a GitHub Artifacts](../../../pull/6)
**Herramienta:** GitHub Copilot (agente de código, `copilot-swe-agent[bot]`)

Al abrir el PR #6 el job "Tests y cobertura" del CI falló (run
`30177775992`, `jest --coverage` terminó con exit code 1): el repositorio no tenía
ningún archivo de test todavía, así que Jest no tenía nada que correr ni cobertura
que reportar.

Se invocó a GitHub Copilot para atender el PR ("Addressing comment on PR #6", run
`30179771688`). Copilot detectó el error y lo solucionó creando los tests que no
existían: el commit `11e4a88` ("test: add baseline Jest tests to fix CI coverage
job") agregó `tests/cart.test.js`, `tests/parser.test.js` y `tests/session.test.js`
(248 líneas). Con esos tests el job de CI pasó y el PR se pudo mergear a `main`.

## Otras sesiones (Objetivos 2A–2C)

Los PRs #3, #4 y #5 (Ángel Mérida) no dejaron registrada evidencia detallada de
prompts/uso de IA — la sección "Uso de herramientas agénticas" de la plantilla de
PR quedó vacía en esos casos. No se documenta contenido inventado aquí; si el
equipo cuenta con capturas o historiales reales de esas sesiones, deben agregarse
citando el PR correspondiente.

