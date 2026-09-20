"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

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

type StockFilter =
  | "TODOS"
  | "DISPONIBLE"
  | "CRITICO"
  | "AGOTADO";

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

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [search, setSearch] =
    useState("");

  const [stockFilter, setStockFilter] =
    useState<StockFilter>("TODOS");

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function refreshProducts() {
    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch(
        "/api/products",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible actualizar los productos.",
        );
      }

      const data =
        (await response.json()) as Product[];

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al actualizar los productos.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const available =
        getAvailableStock(product);

      const matchesSearch =
        normalizedSearch === "" ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.id
          .toLowerCase()
          .includes(normalizedSearch) ||
        (product.description
          ?.toLowerCase()
          .includes(normalizedSearch) ??
          false);

      let matchesStock = true;

      if (stockFilter === "DISPONIBLE") {
        matchesStock =
          available > product.stockMinimo;
      }

      if (stockFilter === "CRITICO") {
        matchesStock =
          available > 0 &&
          available <= product.stockMinimo;
      }

      if (stockFilter === "AGOTADO") {
        matchesStock = available <= 0;
      }

      return (
        matchesSearch &&
        matchesStock
      );
    });
  }, [products, search, stockFilter]);

  const statistics = useMemo(() => {
    const total = products.length;

    const available = products.filter(
      (product) =>
        getAvailableStock(product) >
        product.stockMinimo,
    ).length;

    const critical = products.filter(
      (product) => {
        const stock =
          getAvailableStock(product);

        return (
          stock > 0 &&
          stock <= product.stockMinimo
        );
      },
    ).length;

    const empty = products.filter(
      (product) =>
        getAvailableStock(product) <= 0,
    ).length;

    return {
      total,
      available,
      critical,
      empty,
    };
  }, [products]);

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
          title="Productos"
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

              <h1>Productos</h1>

              <p>
                Catálogo, precios y disponibilidad
                de los productos.
              </p>
            </div>

            <Link
  href="/productos/nuevo"
  className="primary-button"
>
  Nuevo producto
</Link>
          </section>

          <section className="product-stats">
            <article className="product-stat-card">
              <span>TOTAL PRODUCTOS</span>

              <strong>
                {statistics.total}
              </strong>
            </article>

            <article className="product-stat-card">
              <span>DISPONIBLES</span>

              <strong>
                {statistics.available}
              </strong>
            </article>

            <article className="product-stat-card product-stat-critical">
              <span>STOCK CRÍTICO</span>

              <strong>
                {statistics.critical}
              </strong>
            </article>

            <article className="product-stat-card product-stat-empty">
              <span>AGOTADOS</span>

              <strong>
                {statistics.empty}
              </strong>
            </article>
          </section>

          <section className="panel products-panel">
            <div className="products-toolbar">
              <div className="product-search">
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Buscar producto..."
                  aria-label="Buscar producto"
                />
              </div>

              <div className="product-filters">
                <button
                  type="button"
                  className={
                    stockFilter === "TODOS"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setStockFilter("TODOS")
                  }
                >
                  Todos
                </button>

                <button
                  type="button"
                  className={
                    stockFilter === "DISPONIBLE"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setStockFilter(
                      "DISPONIBLE",
                    )
                  }
                >
                  Disponibles
                </button>

                <button
                  type="button"
                  className={
                    stockFilter === "CRITICO"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setStockFilter("CRITICO")
                  }
                >
                  Críticos
                </button>

                <button
                  type="button"
                  className={
                    stockFilter === "AGOTADO"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setStockFilter("AGOTADO")
                  }
                >
                  Agotados
                </button>
              </div>

              <button
                type="button"
                className="refresh-button"
                onClick={() =>
                  void refreshProducts()
                }
                disabled={refreshing}
              >
                {refreshing
                  ? "Actualizando..."
                  : "Actualizar"}
              </button>
            </div>

            {error && (
              <div className="product-error">
                <strong>
                  No se pudieron actualizar
                  los productos.
                </strong>

                <span>{error}</span>

                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    void refreshProducts()
                  }
                >
                  Intentar nuevamente →
                </button>
              </div>
            )}

            <div className="products-result">
              <span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "producto"
                  : "productos"}
              </span>

              {search && (
                <span>
                  Resultado para{" "}
                  <strong>
                    &quot;{search}&quot;
                  </strong>
                </span>
              )}
            </div>

            <div className="table-wrapper products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th>PRECIO</th>
                    <th>COSTO</th>
                    <th>STOCK REAL</th>
                    <th>COMPROMETIDO</th>
                    <th>DISPONIBLE</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => {
                      const available =
                        getAvailableStock(
                          product,
                        );

                      const status =
                        getStockStatus(
                          product,
                        );

                      return (
                        <tr
                          key={product.id}
                          className="product-row"
                        >
                          <td>
                            <div className="product-name-cell">
                              <Link
                                href={`/productos/${product.id}`}
                                className="product-link"
                              >
                                <strong>
                                  {product.name}
                                </strong>

                                <span>
                                  {product.id}
                                </span>
                              </Link>

                              {product.description && (
                                <small>
                                  {
                                    product.description
                                  }
                                </small>
                              )}
                            </div>
                          </td>

                          <td>
                            <strong>
                              {formatCurrency(
                                product.precioVenta,
                              )}
                            </strong>
                          </td>

                          <td>
                            {formatCurrency(
                              product.costo,
                            )}
                          </td>

                          <td>
                            {product.stockReal}
                          </td>

                          <td>
                            {
                              product.stockComprometido
                            }
                          </td>

                          <td>
                            <strong className="available-stock">
                              {available}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`product-status ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="products-empty">
                <strong>
                  No encontramos productos.
                </strong>

                <span>
                  Probá modificando la búsqueda
                  o el filtro seleccionado.
                </span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}