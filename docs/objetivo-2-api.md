# Objetivo 2 — Contrato público de los módulos

Documento de handoff para quienes escriben los tests (integrantes B y C).
Todo lo de `src/` está diseñado para ser testeable **sin stdin/stdout**.

## Mapa de módulos

| Archivo           | Responsabilidad                                | Hace I/O |
| ----------------- | ---------------------------------------------- | -------- |
| `src/cart.js`     | Reglas de negocio del carrito (altas/bajas/cambios) | No |
| `src/parser.js`   | Convierte una línea de texto en un comando      | No |
| `src/messages.js` | Textos de la TUI, según el mock de UX           | No |
| `src/session.js`  | Máquina de estados de la conversación           | No |
| `src/tui.js`      | `readline`, prefijos `\|` y `>`                 | Sí |
| `src/index.js`    | Entry point del binario                         | Sí |

## `cart.js`

```js
const { Cart, OperationStatus } = require('../src/cart');
```

`OperationStatus`: `ADDED`, `UPDATED`, `REMOVED`, `NOT_FOUND`, `UNCHANGED`.

`cart.applyOperation(productId, quantity)` devuelve:

```js
{ status, productId, quantity, previousQuantity }
```

| Escenario                                   | `status`    | Efecto en el carrito       |
| ------------------------------------------- | ----------- | -------------------------- |
| Producto nuevo, cantidad > 0                | `ADDED`     | Se inserta                 |
| Producto existente, cantidad > 0            | `UPDATED`   | Se suma                    |
| Producto existente, resultado > 0           | `UPDATED`   | Baja parcial               |
| Producto existente, resultado <= 0          | `REMOVED`   | Se elimina del carrito     |
| Producto inexistente, cantidad < 0          | `NOT_FOUND` | Sin cambios, **no lanza**  |
| Cantidad === 0                              | `UNCHANGED` | Sin cambios                |

Lanza `TypeError` si `productId` no es string no vacío o si `quantity` no es entero.

Otros métodos: `isEmpty()`, `size()`, `has(id)`, `quantityOf(id)`, `toArray()`, `clear()`.
`toArray()` respeta el orden de inserción y devuelve `[{ productId, quantity }]`.

## `parser.js`

```js
const { parseCommand, CommandType } = require('../src/parser');
```

`parseCommand(raw)` **nunca lanza**. Devuelve `{ type, raw, ... }`:

| Input             | `type`      | Extra                          |
| ----------------- | ----------- | ------------------------------ |
| `"12345 5"`       | `OPERATION` | `productId: '12345'`, `quantity: 5` |
| `"12345 -5"`      | `OPERATION` | `quantity: -5`                 |
| `"bye"` / `"BYE"` | `EXIT`      | —                              |
| `""` / `"   "`    | `EMPTY`     | —                              |
| `"12345"`         | `INVALID`   | `reason` explicativo           |
| `"12345 x"`       | `INVALID`   | `reason` explicativo           |
| `"a b c"`         | `INVALID`   | `reason` explicativo           |

Id válido: `[A-Za-z0-9_-]+`. Cantidad válida: entero con signo opcional.

## `session.js` — para los integration tests

```js
const { Session, SessionState } = require('../src/session');

const session = new Session();
session.start();            // { lines: ['Por favor ingrese su nombre.'], done: false }
session.handle('Rodrigo Custodio'); // { lines: ['Hola Rodrigo! ...'], done: false }
session.handle('12345 5');  // { lines: ['Tu carrito es:', '  - 12345 con 5 unidades', '¿Qué más deseas hacer?'], done: false }
session.handle('bye');      // { lines: ['Adiós fue un gusto atenderte!'], done: true }
```

- Las líneas **no** llevan el prefijo `| `; ese lo agrega `tui.js`.
- El saludo usa solo el primer nombre.
- Se puede inyectar un carrito: `new Session({ cart: miCart })`.

## `tui.js` — test end to end con streams

```js
const { PassThrough } = require('node:stream');
const { runTui } = require('../src/tui');

const input = new PassThrough();
const output = new PassThrough();
let salida = '';
output.on('data', (chunk) => { salida += chunk.toString(); });

const fin = runTui({ input, output, terminal: false });
input.write('Rodrigo Custodio\n12345 5\nbye\n');
await fin;
// salida contiene las líneas con prefijo "| " y los prompts "> "
```

Si el usuario cierra con Ctrl+D sin escribir `bye`, la TUI también imprime la despedida.

## Decisiones tomadas (revisables por el equipo)

1. El mock siempre escribe **"unidades"**, incluso para 1 unidad. Se respetó literalmente.
   Si se quiere pluralizar, el único punto a cambiar es `messages.cartLines()`.
2. Restar más unidades de las que hay (`5` en carrito, `-10`) elimina el producto en vez de dar error.
3. `bye` es case-insensitive.
4. Input vacío no es error: solo repite "¿Qué más deseas hacer?".
5. Se usan los signos de interrogación de apertura (`¿`) y tildes, siguiendo el README actual y no el mock crudo.
