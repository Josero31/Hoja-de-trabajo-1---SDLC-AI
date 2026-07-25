'use strict';

const { Cart, OperationStatus } = require('../src/cart');

describe('Cart', () => {
  test('inicia vacío', () => {
    const cart = new Cart();

    expect(cart.isEmpty()).toBe(true);
    expect(cart.size()).toBe(0);
    expect(cart.toArray()).toEqual([]);
  });

  test('alta de producto nuevo', () => {
    const cart = new Cart();

    const result = cart.applyOperation('12345', 5);

    expect(result).toMatchObject({
      status: OperationStatus.ADDED,
      productId: '12345',
      quantity: 5,
      previousQuantity: 0,
    });
    expect(cart.quantityOf('12345')).toBe(5);
  });

  test('alta incrementa un producto existente', () => {
    const cart = new Cart();
    cart.applyOperation('12345', 2);

    const result = cart.applyOperation('12345', 3);

    expect(result).toMatchObject({
      status: OperationStatus.UPDATED,
      productId: '12345',
      quantity: 5,
      previousQuantity: 2,
    });
    expect(cart.quantityOf('12345')).toBe(5);
  });

  test('baja parcial mantiene el producto en carrito', () => {
    const cart = new Cart();
    cart.applyOperation('12345', 5);

    const result = cart.applyOperation('12345', -2);

    expect(result).toMatchObject({
      status: OperationStatus.UPDATED,
      quantity: 3,
      previousQuantity: 5,
    });
    expect(cart.quantityOf('12345')).toBe(3);
  });

  test('baja total elimina el producto del carrito', () => {
    const cart = new Cart();
    cart.applyOperation('12345', 5);

    const result = cart.applyOperation('12345', -5);

    expect(result).toMatchObject({
      status: OperationStatus.REMOVED,
      quantity: 0,
      previousQuantity: 5,
    });
    expect(cart.has('12345')).toBe(false);
    expect(cart.isEmpty()).toBe(true);
  });

  test('baja de producto inexistente retorna NOT_FOUND sin crash', () => {
    const cart = new Cart();

    const apply = () => cart.applyOperation('missing', -1);

    expect(apply).not.toThrow();
    expect(apply()).toMatchObject({
      status: OperationStatus.NOT_FOUND,
      productId: 'missing',
      quantity: 0,
      previousQuantity: 0,
    });
  });


  test('cantidad cero no cambia carrito', () => {
    const cart = new Cart();
    cart.applyOperation('12345', 2);

    const result = cart.applyOperation('12345', 0);

    expect(result).toMatchObject({
      status: OperationStatus.UNCHANGED,
      quantity: 2,
      previousQuantity: 2,
    });
    expect(cart.quantityOf('12345')).toBe(2);
  });

  test('valida argumentos inválidos', () => {
    const cart = new Cart();

    expect(() => cart.applyOperation('', 1)).toThrow('productId debe ser un string no vacío');
    expect(() => cart.applyOperation('12345', 1.5)).toThrow('quantity debe ser un número entero');
  });
});
