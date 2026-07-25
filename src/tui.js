'use strict';

const readline = require('node:readline');

const { Session } = require('./session');
const messages = require('./messages');

/**
 * Capa de I/O de la TUI. Es la ÚNICA que conoce `readline` y los streams.
 * Toda la lógica vive en session.js / cart.js / parser.js.
 */

/**
 * Devuelve una función que escribe líneas del sistema con el prefijo del mock ("| ").
 * @param {NodeJS.WritableStream} output
 */
function createRenderer(output) {
  return function render(lines) {
    for (const line of lines) {
      output.write(`${messages.LINE_PREFIX}${line}\n`);
    }
  };
}

/**
 * Arranca el loop de interacción.
 *
 * @param {{
 *   input?: NodeJS.ReadableStream,
 *   output?: NodeJS.WritableStream,
 *   session?: Session,
 *   terminal?: boolean
 * }} [options]
 * @returns {Promise<Session>} la sesión ya terminada (útil para tests).
 */
function runTui(options = {}) {
  const input = options.input || process.stdin;
  const output = options.output || process.stdout;
  const session = options.session || new Session();
  const terminal = options.terminal !== undefined ? options.terminal : Boolean(input.isTTY);

  const render = createRenderer(output);

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input,
      output,
      terminal,
      prompt: messages.INPUT_PROMPT,
    });

    render(session.start().lines);
    rl.prompt();

    rl.on('line', (line) => {
      const { lines, done } = session.handle(line);
      render(lines);

      if (done) {
        rl.close();
        return;
      }
      rl.prompt();
    });

    // Ctrl+C / Ctrl+D: cerramos con la misma despedida del mock.
    rl.on('close', () => {
      if (!session.isFinished()) {
        output.write('\n');
        render([messages.farewell()]);
      }
      resolve(session);
    });
  });
}

module.exports = { runTui, createRenderer };
