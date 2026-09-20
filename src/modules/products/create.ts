import { db } from "../../db";
import { products } from "../../db/schema";

export type CreateProductInput = {
  name: string;
  description?: string | null;
  precioVenta: number;
  costo: number;
  stockReal?: number;
  stockMinimo?: number;
};

export class InvalidProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProductError";
  }
}

export async function createProduct({
  name,
  description = null,
  precioVenta,
  costo,
  stockReal = 0,
  stockMinimo = 0,
}: CreateProductInput) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new InvalidProductError(
      "El nombre del producto es obligatorio.",
    );
  }

  if (!Number.isFinite(precioVenta) || precioVenta < 0) {
    throw new InvalidProductError(
      "El precio de venta debe ser un número mayor o igual a cero.",
    );
  }

  if (!Number.isFinite(costo) || costo < 0) {
    throw new InvalidProductError(
      "El costo debe ser un número mayor o igual a cero.",
    );
  }

  if (!Number.isInteger(stockReal) || stockReal < 0) {
    throw new InvalidProductError(
      "El stock real debe ser un entero mayor o igual a cero.",
    );
  }

  if (!Number.isInteger(stockMinimo) || stockMinimo < 0) {
    throw new InvalidProductError(
      "El stock mínimo debe ser un entero mayor o igual a cero.",
    );
  }

  const [product] = await db
    .insert(products)
    .values({
      name: normalizedName,
      description:
        description?.trim() || null,
      precioVenta,
      costo,
      stockReal,
      stockComprometido: 0,
      stockMinimo,
    })
    .returning({
      id: products.id,
      name: products.name,
      description: products.description,
      precioVenta: products.precioVenta,
      costo: products.costo,
      stockReal: products.stockReal,
      stockComprometido:
        products.stockComprometido,
      stockMinimo: products.stockMinimo,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    });

  return product;
}