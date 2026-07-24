'use strict';

/**
 * Lógica de negocio del carrito anónimo de Shop 502.
 * Este módulo es PURO: no importa `readline`, no imprime, no lee stdin.
 * (Ver AGENTS.md -> "Módulos: lógica de negocio separada de I/O").
 */

/** Resultados posibles de aplicar una operación al carrito. */
const OperationStatus = Object.freeze({
  ADDED: 'ADDED', // producto nuevo agregado al carrito
  UPDATED: 'UPDATED', // producto existente cuya cantidad cambió (y sigue > 0)
  REMOVED: 'REMOVED', // producto existente que llegó a 0 o menos -> se elimina
  NOT_FOUND: 'NOT_FOUND', // se intentó restar un producto que no está en el carrito
  UNCHANGED: 'UNCHANGED', // operación con cantidad 0 -> no-op
});

class Cart {
  constructor() {
    /** @type {Map<string, number>} productId -> cantidad (siempre > 0) */
    this.items = new Map();
  }

  /** @returns {boolean} true si no hay ningún producto en el carrito. */
  isEmpty() {
    return this.items.size === 0;
  }

  /** @returns {number} cantidad de productos distintos en el carrito. */
  size() {
    return this.items.size;
  }

  /** @returns {boolean} true si el producto está en el carrito. */
  has(productId) {
    return this.items.has(productId);
  }

  /** @returns {number} unidades del producto; 0 si no está en el carrito. */
  quantityOf(productId) {
    return this.items.get(productId) || 0;
  }

  /**
   * Snapshot inmutable del carrito, en orden de inserción.
   * @returns {Array<{productId: string, quantity: number}>}
   */
  toArray() {
    return Array.from(this.items, ([productId, quantity]) => ({ productId, quantity }));
  }

  /** Vacía el carrito por completo. */
  clear() {
    this.items.clear();
  }

  /**
   * Aplica una operación de alta/baja/cambio sobre el carrito.
   *
   * Reglas:
   *  - cantidad > 0 sobre producto nuevo      -> ADDED
   *  - cantidad > 0 sobre producto existente  -> UPDATED (suma)
   *  - cantidad < 0 sobre producto existente:
   *      * si el resultado queda > 0          -> UPDATED (baja parcial)
   *      * si el resultado queda <= 0         -> REMOVED (baja total, se elimina)
   *  - cantidad < 0 sobre producto inexistente -> NOT_FOUND (no lanza error)
   *  - cantidad === 0                          -> UNCHANGED
   *
   * @param {string} productId
   * @param {number} quantity entero (positivo suma, negativo resta)
   * @returns {{status: string, productId: string, quantity: number, previousQuantity: number}}
   * @throws {TypeError} si los argumentos no tienen el tipo esperado.
   */
  applyOperation(productId, quantity) {
    if (typeof productId !== 'string' || productId.trim() === '') {
      throw new TypeError('productId debe ser un string no vacío');
    }
    if (!Number.isInteger(quantity)) {
      throw new TypeError('quantity debe ser un número entero');
    }

    const previousQuantity = this.items.has(productId) ? this.items.get(productId) : 0;

    if (quantity === 0) {
      return this.#result(OperationStatus.UNCHANGED, productId, previousQuantity, previousQuantity);
    }

    if (!this.items.has(productId)) {
      if (quantity < 0) {
        return this.#result(OperationStatus.NOT_FOUND, productId, 0, 0);
      }
      this.items.set(productId, quantity);
      return this.#result(OperationStatus.ADDED, productId, quantity, 0);
    }

    const nextQuantity = previousQuantity + quantity;

    if (nextQuantity <= 0) {
      this.items.delete(productId);
      return this.#result(OperationStatus.REMOVED, productId, 0, previousQuantity);
    }

    this.items.set(productId, nextQuantity);
    return this.#result(OperationStatus.UPDATED, productId, nextQuantity, previousQuantity);
  }

  #result(status, productId, quantity, previousQuantity) {
    return { status, productId, quantity, previousQuantity };
  }
}

module.exports = { Cart, OperationStatus };
