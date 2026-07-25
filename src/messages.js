'use strict';

/**
 * Textos de la TUI centralizados en funciones puras.
 * Cada función devuelve UNA línea (o un arreglo de líneas) SIN el prefijo "| ".
 * El prefijo lo agrega la capa de render en tui.js.
 *
 * El formato exacto proviene del mock entregado por UX + Product Owner (ver README).
 */

/** Prefijo de salida del sistema, según el mock. */
const LINE_PREFIX = '| ';

/** Prompt de entrada del usuario, según el mock. */
const INPUT_PROMPT = '> ';

function askName() {
  return 'Por favor ingrese su nombre.';
}

function nameRequired() {
  return 'Necesito tu nombre para continuar. Por favor ingrese su nombre.';
}

/**
 * Saludo inicial. Usa únicamente el primer nombre ("Rodrigo Custodio" -> "Rodrigo").
 * @param {string} fullName
 */
function greet(fullName) {
  return `Hola ${firstNameOf(fullName)}! ¿Qué deseas modificar en tu carrito?`;
}

function whatElse() {
  return '¿Qué más deseas hacer?';
}

function emptyCart() {
  return 'Tu carrito está vacío, ¿qué más deseas hacer?';
}

/**
 * @param {string} productId
 */
function productNotFound(productId) {
  return `Oops parece que no tienes el producto ${productId} agregado a tu carrito. ¿Qué más deseas hacer?`;
}

/**
 * @param {string} reason
 */
function invalidCommand(reason) {
  return `No entendí eso. ${reason} ¿Qué más deseas hacer?`;
}

function farewell() {
  return 'Adiós fue un gusto atenderte!';
}

/**
 * Listado del carrito, sin la pregunta final.
 * NOTA: el mock siempre usa "unidades" (incluso para 1 unidad); se respeta tal cual.
 *
 * @param {Array<{productId: string, quantity: number}>} items
 * @returns {string[]}
 */
function cartLines(items) {
  return ['Tu carrito es:', ...items.map((item) => `  - ${item.productId} con ${item.quantity} unidades`)];
}

/**
 * @param {string} fullName
 * @returns {string} primer token del nombre; el nombre completo si no hay espacios.
 */
function firstNameOf(fullName) {
  const trimmed = String(fullName || '').trim();
  if (trimmed === '') return '';
  return trimmed.split(/\s+/)[0];
}

module.exports = {
  LINE_PREFIX,
  INPUT_PROMPT,
  askName,
  nameRequired,
  greet,
  whatElse,
  emptyCart,
  productNotFound,
  invalidCommand,
  farewell,
  cartLines,
  firstNameOf,
};
