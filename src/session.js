'use strict';

const { Cart, OperationStatus } = require('./cart');
const { parseCommand, CommandType } = require('./parser');
const messages = require('./messages');

/**
 * Máquina de estados de la conversación con el usuario.
 *
 * No hace I/O: recibe strings y devuelve líneas de texto. Eso permite
 * escribir integration tests de todo el flujo sin necesidad de stdin/stdout.
 */
const SessionState = Object.freeze({
  AWAITING_NAME: 'AWAITING_NAME',
  AWAITING_COMMAND: 'AWAITING_COMMAND',
  FINISHED: 'FINISHED',
});

class Session {
  /**
   * @param {{cart?: Cart}} [options]
   */
  constructor(options = {}) {
    this.cart = options.cart || new Cart();
    this.state = SessionState.AWAITING_NAME;
    this.userName = null;
  }

  /** @returns {boolean} */
  isFinished() {
    return this.state === SessionState.FINISHED;
  }

  /**
   * Primer mensaje de la sesión.
   * @returns {{lines: string[], done: boolean}}
   */
  start() {
    return { lines: [messages.askName()], done: false };
  }

  /**
   * Procesa una línea del usuario y devuelve la respuesta del sistema.
   * @param {string} input
   * @returns {{lines: string[], done: boolean}}
   */
  handle(input) {
    if (this.state === SessionState.FINISHED) {
      return { lines: [], done: true };
    }
    if (this.state === SessionState.AWAITING_NAME) {
      return this.#handleName(input);
    }
    return this.#handleCommand(input);
  }

  #handleName(input) {
    const name = String(input || '').trim();

    if (name === '') {
      return { lines: [messages.nameRequired()], done: false };
    }

    this.userName = name;
    this.state = SessionState.AWAITING_COMMAND;
    return { lines: [messages.greet(name)], done: false };
  }

  #handleCommand(input) {
    const command = parseCommand(input);

    switch (command.type) {
      case CommandType.EXIT:
        this.state = SessionState.FINISHED;
        return { lines: [messages.farewell()], done: true };

      case CommandType.EMPTY:
        return { lines: [messages.whatElse()], done: false };

      case CommandType.INVALID:
        return { lines: [messages.invalidCommand(command.reason)], done: false };

      case CommandType.OPERATION:
        return { lines: this.#applyOperation(command), done: false };

      /* istanbul ignore next -- rama inalcanzable: parseCommand solo emite los 4 tipos de arriba */
      default:
        return { lines: [messages.whatElse()], done: false };
    }
  }

  #applyOperation(command) {
    const result = this.cart.applyOperation(command.productId, command.quantity);

    if (result.status === OperationStatus.NOT_FOUND) {
      return [messages.productNotFound(command.productId)];
    }

    if (this.cart.isEmpty()) {
      return [messages.emptyCart()];
    }

    return [...messages.cartLines(this.cart.toArray()), messages.whatElse()];
  }
}

module.exports = { Session, SessionState };
