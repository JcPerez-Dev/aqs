"use client";

import Link from "next/link";
import { useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Header from "../../../components/layout/Header";

interface Product {
  id: string;
  name: string;
  description: string | null;
  precioVenta: number;
  costo: number;
  stockReal: number;
  stockComprometido: number;
  stockMinimo: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailClientProps {
  product: Product;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

function getAvailableStock(product: Product) {
  return (
    product.stockReal -
    product.stockComprometido
  );
}

function getStockStatus(product: Product) {
  const available =
    getAvailableStock(product);

  if (available <= 0) {
    return {
      label: "Agotado",
      className: "product-status-empty",
    };
  }

  if (available <= product.stockMinimo) {
    return {
      label: "Stock crítico",
      className: "product-status-critical",
    };
  }

  return {
    label: "Disponible",
    className: "product-status-available",
  };
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const available =
    getAvailableStock(product);

  const status =
    getStockStatus(product);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="main-area">
        <Header
          title="Producto"
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <div className="content">
          <section className="page-heading">
            <div>
              <span className="eyebrow">
                GESTIÓN DE PRODUCTOS
              </span>

              <h1>{product.name}</h1>

              <p>
                Detalle, precios y disponibilidad
                del producto.
              </p>
            </div>

            <Link
              href="/productos"
              className="secondary-button"
            >
              ← Volver a productos
            </Link>
          </section>

          <section className="product-stats">
            <article className="product-stat-card">
              <span>PRECIO DE VENTA</span>

              <strong>
                {formatCurrency(
                  product.precioVenta,
                )}
              </strong>
            </article>

            <article className="product-stat-card">
              <span>COSTO</span>

              <strong>
                {formatCurrency(product.costo)}
              </strong>
            </article>

            <article className="product-stat-card">
              <span>STOCK DISPONIBLE</span>

              <strong>
                {available}
              </strong>
            </article>

            <article
              className={`product-stat-card ${
                status.className ===
                "product-status-empty"
                  ? "product-stat-empty"
                  : status.className ===
                      "product-status-critical"
                    ? "product-stat-critical"
                    : ""
              }`}
            >
              <span>ESTADO</span>

              <strong>
                {status.label}
              </strong>
            </article>
          </section>

          <section className="panel products-panel">
            <div className="products-result">
              <span>
                Información del producto
              </span>
            </div>

            <div className="product-detail-grid">
              <div className="product-detail-item">
                <span>ID</span>

                <strong>{product.id}</strong>
              </div>

              <div className="product-detail-item">
                <span>DESCRIPCIÓN</span>

                <strong>
                  {product.description ||
                    "Sin descripción"}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>STOCK REAL</span>

                <strong>
                  {product.stockReal}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>STOCK COMPROMETIDO</span>

                <strong>
                  {product.stockComprometido}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>STOCK MÍNIMO</span>

                <strong>
                  {product.stockMinimo}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>STOCK DISPONIBLE</span>

                <strong className="available-stock">
                  {available}
                </strong>
              </div>
            </div>

            <div className="product-detail-status">
              <span
                className={`product-status ${status.className}`}
              >
                {status.label}
              </span>

              {available <=
                product.stockMinimo && (
                <span>
                  El stock disponible se encuentra
                  en el nivel mínimo establecido.
                </span>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}