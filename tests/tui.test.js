'use strict';

const { PassThrough } = require('node:stream');
const { runTui, createRenderer } = require('../src/tui');

function makeStreams() {
  const input = new PassThrough();
  const output = new PassThrough();
  let salida = '';
  output.on('data', (chunk) => {
    salida += chunk.toString();
  });
  return { input, output, getOutput: () => salida };
}

describe('runTui', () => {
  test('imprime el saludo inicial con el prefijo del mock y el prompt', async () => {
    const { input, output, getOutput } = makeStreams();

    const fin = runTui({ input, output, terminal: false });
    input.end('bye\n');
    await fin;

    expect(getOutput().startsWith('| Por favor ingrese su nombre.\n> ')).toBe(true);
  });

  test('flujo completo del mock del README termina con la despedida', async () => {
    const { input, output, getOutput } = makeStreams();

    const fin = runTui({ input, output, terminal: false });
    input.end(['Rodrigo Custodio', '12345 5', '12345 -5', '456 29', 'bye', ''].join('\n'));
    const session = await fin;

    const salida = getOutput();
    expect(salida).toContain('| Hola Rodrigo! ¿Qué deseas modificar en tu carrito?');
    expect(salida).toContain('|   - 12345 con 5 unidades');
    expect(salida).toContain('| Tu carrito está vacío, ¿qué más deseas hacer?');
    expect(salida).toContain('|   - 456 con 29 unidades');
    expect(salida.trim().endsWith('| Adiós fue un gusto atenderte!')).toBe(true);
    expect(session.isFinished()).toBe(true);
  });

  test('cerrar el input sin escribir "bye" igual imprime la despedida', async () => {
    const { input, output, getOutput } = makeStreams();

    const fin = runTui({ input, output, terminal: false });
    input.write('Rodrigo Custodio\n');
    input.end();
    const session = await fin;

    expect(getOutput()).toContain('| Adiós fue un gusto atenderte!');
    expect(session.isFinished()).toBe(false);
  });
});

describe('createRenderer', () => {
  test('escribe cada línea con el prefijo "| " del mock', () => {
    const { output, getOutput } = makeStreams();
    const render = createRenderer(output);

    render(['línea uno', 'línea dos']);

    expect(getOutput()).toBe('| línea uno\n| línea dos\n');
  });

  test('no escribe nada si la lista de líneas está vacía', () => {
    const { output, getOutput } = makeStreams();
    const render = createRenderer(output);

    render([]);

    expect(getOutput()).toBe('');
  });
});
