import { NextResponse } from "next/server";

import {
  createProduct,
  InvalidProductError,
} from "../../../modules/products/create";
import { listProducts } from "../../../modules/products/list";

type CreateProductBody = {
  name: string;
  description?: string | null;
  precioVenta: number;
  costo: number;
  stockReal?: number;
  stockMinimo?: number;
};

export async function GET() {
  const products = await listProducts();

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  let body: CreateProductBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error:
          "El cuerpo de la solicitud debe ser JSON válido.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    typeof body?.name !== "string" ||
    body.name.trim().length === 0
  ) {
    return NextResponse.json(
      {
        error: "El nombre del producto es obligatorio.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    typeof body?.precioVenta !== "number" ||
    typeof body?.costo !== "number"
  ) {
    return NextResponse.json(
      {
        error:
          "precioVenta y costo deben ser números.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const product = await createProduct({
      name: body.name,
      description: body.description,
      precioVenta: body.precioVenta,
      costo: body.costo,
      stockReal: body.stockReal,
      stockMinimo: body.stockMinimo,
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof InvalidProductError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      );
    }

    throw error;
  }
}