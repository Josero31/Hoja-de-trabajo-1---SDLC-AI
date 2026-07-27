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

# Evidencia de uso de agentic coding

Este documento registra el uso de herramientas de agentic coding en el proyecto:
**Claude** (chat, usado por Ángel Mérida / `SaintPage` durante el Objetivo 2) y
**Claude Code** + **GitHub Copilot** (usados por Jose / `Josero31` en el
Objetivo 1 y en revisiones posteriores).

## Sesión Objetivo 2A: setup del repo (PR #3 — `chore/project-setup`)

**Fecha:** 2026-07-24
**Rama:** `chore/project-setup`
**Herramienta:** Claude (chat)

### Contexto / prompt

Se le compartió a Claude el enunciado completo del problema (mock de la TUI,
requisitos de Shop 502: 80 % de cobertura, GitHub Flow, branch protection, CI
en cada PR, CD que publique a GitHub Artifacts, `AGENTS.md`) y se le pidió que
resolviera el Objetivo 2 completo (sin la parte de tests, asignada a otro
compañero), dividiéndolo en PRs pequeñas.

### Qué generó

- `package.json` con scripts (`start`, `test`, `build`) y configuración de
  Jest con umbral de cobertura del 80 %.
- `jest.config.js`, `.gitignore` (`node_modules/`, `dist/`, `coverage/`).
- `LICENSE` (MIT), necesario para que el repo fuera legalmente open source y
  no solo público.
- `.github/pull_request_template.md`, con un checklist alineado a las reglas
  del proyecto (rama parte de `main`, `pnpm test` pasa, cobertura no baja del
  80 %, review de alguien que no sea el autor).

### Qué se decidió manualmente

- Dividir el trabajo en 4 PRs (setup, lógica, TUI, CI/CD) en vez de una sola,
  para que el review fuera más manejable y siguiera el espíritu de GitHub Flow.

## Sesión Objetivo 2B: lógica del carrito (PR #4 — `feature/cart-logic`)

**Fecha:** 2026-07-24
**Rama:** `feature/cart-logic`
**Herramienta:** Claude (chat)

### Qué generó

- `src/cart.js`: lógica pura del carrito (sin tocar stdin/stdout), con
  `applyOperation(productId, quantity)` devolviendo un status
  (`ADDED`, `UPDATED`, `REMOVED`, `NOT_FOUND`, `UNCHANGED`) según las reglas de
  alta/baja/cambio del enunciado.
- `src/parser.js`: convierte una línea cruda (`"12345 5"`, `"bye"`, líneas
  vacías o malformadas) en un comando estructurado, sin lanzar errores nunca.
- `docs/objetivo-2-api.md`: contrato público de ambos módulos, pensado para
  que quien escribiera los tests (Objetivo 2B/2C de test) no tuviera que leer
  todo el código para saber qué esperar de cada función.

### Qué se verificó

Se corrió manualmente el módulo con casos borde (restar más de lo que hay en
el carrito, ids/cantidades inválidas, cantidad 0) antes de darlo por bueno,
para confirmar que coincidía con el comportamiento implícito en el mock.

## Sesión Objetivo 2C: capa de TUI (PR #5 — `feature/tui-layer`)

**Fecha:** 2026-07-24
**Rama:** `feature/tui-layer`
**Herramienta:** Claude (chat)

### Qué generó

- `src/messages.js`: los textos exactos del mock de UX (saludo con el primer
  nombre, listado del carrito, mensajes de carrito vacío/producto no
  encontrado, despedida).
- `src/session.js`: máquina de estados de la conversación (`AWAITING_NAME` →
  `AWAITING_COMMAND` → `FINISHED`), sin ningún I/O — pensada para poder
  simular toda una conversación llamando `session.handle(linea)` sin
  necesidad de un stream real.
- `src/tui.js` y `src/index.js`: la única capa que usa `readline`, con el
  prefijo `| ` y el prompt `> ` del mock.

### Qué se verificó

Se corrió `node src/index.js` alimentando exactamente el input del mock
(`Rodrigo Custodio`, `12345 5`, `12345 -5`, `12345 -5`, `456 29`, `bye`) y se
comparó la salida línea por línea contra el mock del enunciado, además de
probar casos no cubiertos por el mock (input vacío, formato inválido, cierre
con Ctrl+D en vez de `bye`).

## Sesión Objetivo 2D: CI/CD (PR #6 — `ci/pipelines`)

**Fecha:** 2026-07-25
**Rama:** `ci/pipelines`
**Herramienta:** Claude (chat)

### Qué generó

- `.github/workflows/ci.yml`: corre `pnpm test` en cada PR hacia `main` y en
  cada push a `main`.
- `.github/workflows/cd.yml`: en cada push a `main`, corre los tests primero
  y solo si pasan compila el binario con `pkg` y lo publica a GitHub
  Artifacts (para no publicar un binario que no pasó los tests).

### Qué se verificó

Se instaló `@yao-pkg/pkg` en un entorno de prueba y se compiló el binario
localmente para confirmar que el `pnpm build` del workflow funcionaba antes
de escribir el YAML, y se corrió el binario resultante contra el mock para
confirmar que el ejecutable compilado se comportaba igual que con `node`.

### Soporte durante la apertura y revisión de esta PR

Ya con el repo en GitHub, Claude ayudó a resolver problemas puntuales del
flujo, fuera del código en sí:

- `pnpm` no estaba instalado en la máquina (Git Bash / MINGW64) — se explicó
  cómo activarlo con `corepack enable` + `corepack prepare pnpm@latest --activate`.
- Falta de claridad sobre el flujo de Pull Requests de GitHub Flow (que el
  `git push` de una rama no abre la PR automáticamente, hay que crearla desde
  GitHub, y hay que volver a `main` y hacer `pull` antes de ramificar de
  nuevo).
- Cuando el PR #6 mostró "All checks have failed" y "Review required" a la
  vez, se ayudó a diferenciar los dos problemas: uno era que la rama todavía
  no tenía el código de las otras PRs (se resolvió hacienda `git merge
  origin/main`), y el otro era que un comentario tipo "Nice job" no cuenta
  como aprobación formal en GitHub — hace falta usar "Review changes → Approve".

## GitHub Copilot arregló el CI del PR #6

**Fecha:** 2026-07-25
**PR:** [#6 — ci: pipelines de tests y publicación de binario a GitHub Artifacts](../../../pull/6)
**Herramienta:** GitHub Copilot (agente de código, `copilot-swe-agent[bot]`)

Al abrir el PR #6 el job "Tests y cobertura" del CI falló (run
`30177775992`, `jest --coverage` terminó con exit code 1): el repositorio no
tenía ningún archivo de test todavía, así que Jest no tenía nada que correr ni
cobertura que reportar.

Se invocó a GitHub Copilot para atender el PR ("Addressing comment on PR #6",
run `30179771688`). Copilot detectó el error y lo solucionó creando los tests
que no existían: el commit `11e4a88` ("test: add baseline Jest tests to fix CI
coverage job") agregó `tests/cart.test.js`, `tests/parser.test.js` y
`tests/session.test.js` (248 líneas). Con esos tests el job de CI pasó y el
PR se pudo mergear a `main`.

## Sesión documentada: auditoría y actualización de documentación

**Fecha:** 2026-07-25
**Rama:** `Jose`
**Herramienta:** Claude Code (CLI), modelo Sonnet 5

### Contexto / prompt del usuario

Se le pidió al agente que cerrara los pendientes señalados en una revisión
previa del repositorio:

1. Completar los marcadores de "pendiente" del README (integrantes, sección de
   agentic workflow, licencia, nota desactualizada sobre `package.json`).
2. Agregar/completar `docs/agentic-workflow.md` con evidencia real de uso de IA.
3. Revisar coherencia entre el README/docs y lo que el código realmente
   implementa.
4. Verificar que los tests pasan, que se cumple la cobertura mínima de 80 % y
   que `pnpm build` genera los binarios.

### Qué generó/ejecutó el agente

- Cambió a la rama `main` para inspeccionar el estado real del repo (la rama
  `Jose` estaba desactualizada y no reflejaba `package.json`, `LICENSE`,
  `docs/`, `src/` ni `tests/`, que ya existían en `main`).
- Ejecutó `pnpm install`, `pnpm test` (vía `npx pnpm`, ya que `pnpm` no estaba
  instalado globalmente) y confirmó: 3 test suites, 21 tests, todos verdes.
- Leyó `docs/objetivo-2-api.md` y lo comparó línea por línea contra
  `src/cart.js`, `src/parser.js`, `src/session.js`, `src/tui.js` y
  `src/messages.js` — confirmó que el contrato documentado coincide con la
  implementación real (estados de `OperationStatus`, tipos de `CommandType`,
  formato de mensajes, comportamiento de `Session`).
- Identificó, mediante `git log`/`gh pr list`, que todos los commits y PRs de
  los Objetivos 2A–2D fueron autoría de Ángel Mérida (`SaintPage`), y usó esa
  evidencia (confirmada con el usuario) para completar la tabla de
  integrantes del README.
- Confirmó con `gh run list` que los workflows `CI` y `CD` corrieron
  exitosamente sobre `main` (incluyendo `pnpm build` generando los binarios de
  `dist/`), dado que el build falla localmente en este entorno Windows por una
  limitación de sandbox al invocar el fetch de binarios de `pkg` (no es un
  problema del proyecto).
- Editó `README.md`: reemplazó los tres marcadores de "pendiente"/desactualizado
  (integrantes, sección de agentic workflow, licencia) y quitó la nota
  obsoleta sobre la ausencia de `package.json`.

### Qué se editó/decidió manualmente

- La decisión de a quién asignar cada objetivo en la tabla de integrantes se
  confirmó explícitamente con el usuario antes de escribirla (el historial de
  git por sí solo era evidencia suficiente, pero no autoritativa).
- El alcance de este documento (qué contar como "evidencia") también se
  acordó con el usuario: se documenta únicamente lo verificable — de esta
  sesión, de las sesiones de Ángel, o de historial de git/GitHub Actions que
  se puede confirmar con `git log` y `gh run list` — sin inventar prompts o
  transcripts que no quedaron registrados.
- Todos los cambios de esta sesión se hicieron sobre la rama `Jose` y se
  subieron como Pull Request hacia `main`, siguiendo el flujo GitHub Flow del
  proyecto (revisión de un compañero antes de mergear).

## Gaps detectados y corregidos

La IA ayudó a detectar errores/huecos en los tests que luego se corrigieron en
la misma sesión: `tui.js` e `index.js` no tenían ningún test, y Jest los
excluía del reporte de cobertura en vez de contarlos como no cubiertos. Se
agregó `tests/tui.test.js` y se configuró `coverageThreshold` (80 %) en
`package.json` para que el umbral se haga cumplir de verdad. `pnpm test` ahora
pasa 26/26.
