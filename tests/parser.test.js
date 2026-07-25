'use strict';

const { parseCommand, CommandType, EXIT_KEYWORD } = require('../src/parser');

describe('parseCommand', () => {
  test('detecta comando de salida sin importar mayúsculas', () => {
    expect(parseCommand(EXIT_KEYWORD.toUpperCase())).toMatchObject({ type: CommandType.EXIT });
  });

  test('detecta input vacío', () => {
    expect(parseCommand('   ')).toMatchObject({ type: CommandType.EMPTY });
  });

  test('detecta formato inválido por cantidad faltante', () => {
    const result = parseCommand('12345');

    expect(result.type).toBe(CommandType.INVALID);
    expect(result.reason).toContain('El formato debe ser');
  });

  test('detecta cantidad no entera', () => {
    const result = parseCommand('12345 3.5');

    expect(result.type).toBe(CommandType.INVALID);
    expect(result.reason).toContain('no es una cantidad válida');
  });

  test('parsea operación válida con cantidad negativa', () => {
    expect(parseCommand('abc_1 -2')).toEqual({
      type: CommandType.OPERATION,
      raw: 'abc_1 -2',
      productId: 'abc_1',
      quantity: -2,
    });
  });
});
