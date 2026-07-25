'use strict';

const { Session } = require('../src/session');

describe('Session conversation flow', () => {
  function startReadySession(name = 'Jose') {
    const session = new Session();
    session.start();
    session.handle(name);
    return session;
  }

  test('múltiples productos se formatean correctamente', () => {
    const session = startReadySession();

    session.handle('A1 2');
    const response = session.handle('B2 3');

    expect(response.done).toBe(false);
    expect(response.lines).toEqual([
      'Tu carrito es:',
      '  - A1 con 2 unidades',
      '  - B2 con 3 unidades',
      '¿Qué más deseas hacer?',
    ]);
  });

  test('bye con carrito vacío finaliza con despedida', () => {
    const session = startReadySession();

    const response = session.handle('bye');

    expect(response).toEqual({
      lines: ['Adiós fue un gusto atenderte!'],
      done: true,
    });
    expect(session.isFinished()).toBe(true);
  });

  test('bye con productos también finaliza con despedida', () => {
    const session = startReadySession();
    session.handle('12345 1');

    const response = session.handle('bye');

    expect(response).toEqual({
      lines: ['Adiós fue un gusto atenderte!'],
      done: true,
    });
    expect(session.isFinished()).toBe(true);
  });

  test('input malformado (sin cantidad) no crashea y responde inválido', () => {
    const session = startReadySession();

    const call = () => session.handle('12345');

    expect(call).not.toThrow();
    expect(call().lines[0]).toMatch(/^No entendí eso\./);
  });

  test('input malformado (cantidad no numérica) no crashea y responde inválido', () => {
    const session = startReadySession();

    const call = () => session.handle('12345 dos');

    expect(call).not.toThrow();
    expect(call().lines[0]).toContain('no es una cantidad válida');
  });


  test('si el nombre está vacío vuelve a pedirlo', () => {
    const session = new Session();

    const response = session.handle('   ');

    expect(response).toEqual({
      lines: ['Necesito tu nombre para continuar. Por favor ingrese su nombre.'],
      done: false,
    });
    expect(session.isFinished()).toBe(false);
  });

  test('línea vacía en comandos responde pregunta de continuación', () => {
    const session = startReadySession();

    const response = session.handle('   ');

    expect(response).toEqual({
      lines: ['¿Qué más deseas hacer?'],
      done: false,
    });
  });

  test('restar producto inexistente responde mensaje esperado', () => {
    const session = startReadySession();

    const response = session.handle('X1 -1');

    expect(response).toEqual({
      lines: ['Oops parece que no tienes el producto X1 agregado a tu carrito. ¿Qué más deseas hacer?'],
      done: false,
    });
  });
});
