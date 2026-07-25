'use strict';

/**
 * Parser del input del usuario. Módulo puro (sin I/O).
 * Formato esperado: "<id_producto> <cantidad>" usando espacio como delimitador.
 * Comando de salida: "bye".
 */

const CommandType = Object.freeze({
  OPERATION: 'OPERATION', // "12345 5"
  EXIT: 'EXIT', // "bye"
  EMPTY: 'EMPTY', // línea en blanco
  INVALID: 'INVALID', // cualquier otra cosa
});

const EXIT_KEYWORD = 'bye';
const PRODUCT_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const INTEGER_PATTERN = /^[+-]?\d+$/;

/**
 * Convierte una línea cruda de stdin en un comando estructurado.
 * Nunca lanza: cualquier input malformado devuelve INVALID.
 *
 * @param {unknown} raw
 * @returns {{type: string, raw: string, productId?: string, quantity?: number, reason?: string}}
 */
function parseCommand(raw) {
  const rawText = typeof raw === 'string' ? raw : '';
  const input = rawText.trim();

  if (input === '') {
    return { type: CommandType.EMPTY, raw: rawText };
  }

  if (input.toLowerCase() === EXIT_KEYWORD) {
    return { type: CommandType.EXIT, raw: rawText };
  }

  const tokens = input.split(/\s+/);

  if (tokens.length !== 2) {
    return {
      type: CommandType.INVALID,
      raw: rawText,
      reason: 'El formato debe ser "<id de producto> <cantidad>", por ejemplo "12345 5".',
    };
  }

  const [productId, rawQuantity] = tokens;

  if (!PRODUCT_ID_PATTERN.test(productId)) {
    return {
      type: CommandType.INVALID,
      raw: rawText,
      reason: `"${productId}" no es un id de producto válido.`,
    };
  }

  if (!INTEGER_PATTERN.test(rawQuantity)) {
    return {
      type: CommandType.INVALID,
      raw: rawText,
      reason: `"${rawQuantity}" no es una cantidad válida, debe ser un número entero.`,
    };
  }

  return {
    type: CommandType.OPERATION,
    raw: rawText,
    productId,
    quantity: Number.parseInt(rawQuantity, 10),
  };
}

module.exports = { parseCommand, CommandType, EXIT_KEYWORD };
