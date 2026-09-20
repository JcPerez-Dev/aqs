"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../../components/layout/Header";
import Sidebar from "../../../components/layout/Sidebar";

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

interface OrderItem {
  productId: string;
  quantity: number;
}

const TEST_USER_ID = "test-user-orders";

function getAvailableStock(product: Product) {
  return product.stockReal - product.stockComprometido;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function NuevoPedidoClient() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("1");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "No fue posible cargar los productos.",
          );
        }

        const data = (await response.json()) as Product[];

        setProducts(data);
      } catch (err) {
        setProductsError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error al cargar los productos.",
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    void loadProducts();
  }, []);

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === selectedProductId,
      ) ?? null,
    [products, selectedProductId],
  );

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find(
        (currentProduct) =>
          currentProduct.id === item.productId,
      );

      if (!product) {
        return sum;
      }

      return sum + product.precioVenta * item.quantity;
    }, 0);
  }, [items, products]);

  function addItem() {
    setError("");

    if (!selectedProduct) {
      setError("Seleccioná un producto.");
      return;
    }

    const quantity = Number(selectedQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("La cantidad debe ser un entero mayor a cero.");
      return;
    }

    const availableStock = getAvailableStock(selectedProduct);

    const existingItem = items.find(
      (item) => item.productId === selectedProduct.id,
    );

    const existingQuantity = existingItem?.quantity ?? 0;
    const newQuantity = existingQuantity + quantity;

    if (newQuantity > availableStock) {
      setError(
        `No hay stock suficiente de "${selectedProduct.name}". Disponible: ${availableStock}.`,
      );
      return;
    }

    if (existingItem) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === selectedProduct.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item,
        ),
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          productId: selectedProduct.id,
          quantity,
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQuantity("1");
  }

  function updateQuantity(
    productId: string,
    quantity: number,
  ) {
    const product = products.find(
      (currentProduct) =>
        currentProduct.id === productId,
    );

    if (!product) {
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      removeItem(productId);
      return;
    }

    const availableStock = getAvailableStock(product);

    if (quantity > availableStock) {
      setError(
        `No hay stock suficiente de "${product.name}". Disponible: ${availableStock}.`,
      );
      return;
    }

    setError("");

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  function removeItem(productId: string) {
    setError("");

    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId,
      ),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError(
        "Agregá al menos un producto al pedido.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "No se pudo crear el pedido.",
        );
      }

      router.push(`/pedidos`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        <Header
          title="Nuevo pedido"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                GESTIÓN DE PEDIDOS
              </span>

              <h1>Nuevo pedido</h1>

              <p>
                Seleccioná los productos y cantidades para
                generar un nuevo pedido.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <section className="products-panel">
              <div className="products-toolbar">
                <div>
                  <strong>Agregar productos</strong>

                  <span>
                    Seleccioná un producto y la cantidad
                    solicitada.
                  </span>
                </div>

                <Link
                  href="/pedidos"
                  className="secondary-button"
                >
                  Volver a pedidos
                </Link>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="product">
                    Producto
                  </label>

                  <select
                    id="product"
                    value={selectedProductId}
                    onChange={(event) =>
                      setSelectedProductId(
                        event.target.value,
                      )
                    }
                    disabled={
                      loadingProducts || submitting
                    }
                  >
                    <option value="">
                      {loadingProducts
                        ? "Cargando productos..."
                        : "Seleccionar producto"}
                    </option>

                    {products.map((product) => {
                      const available =
                        getAvailableStock(product);

                      return (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={available <= 0}
                        >
                          {product.name} — Disponible:{" "}
                          {available}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="quantity">
                    Cantidad
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={selectedQuantity}
                    onChange={(event) =>
                      setSelectedQuantity(
                        event.target.value,
                      )
                    }
                    disabled={
                      loadingProducts || submitting
                    }
                  />
                </div>

                <div className="form-field">
                  <label>&nbsp;</label>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={addItem}
                    disabled={
                      loadingProducts ||
                      submitting ||
                      !selectedProductId
                    }
                  >
                    Agregar producto
                  </button>
                </div>
              </div>

              {selectedProduct && (
                <div className="products-result">
                  <span>
                    Precio:
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedProduct.precioVenta,
                    )}
                  </strong>

                  <span>
                    Stock disponible:{" "}
                    {getAvailableStock(selectedProduct)}
                  </span>
                </div>
              )}

              {productsError && (
                <div className="product-error">
                  <strong>
                    No se pudieron cargar los productos.
                  </strong>

                  <span>{productsError}</span>
                </div>
              )}
            </section>

            <section className="products-panel">
              <div className="products-toolbar">
                <div>
                  <strong>Detalle del pedido</strong>

                  <span>
                    Productos incluidos en este pedido.
                  </span>
                </div>

                <strong>
                  {items.length}{" "}
                  {items.length === 1
                    ? "producto"
                    : "productos"}
                </strong>
              </div>

              {items.length === 0 ? (
                <div className="products-empty">
                  <strong>
                    Todavía no hay productos.
                  </strong>

                  <span>
                    Seleccioná un producto arriba para
                    comenzar el pedido.
                  </span>
                </div>
              ) : (
                <div className="table-wrapper products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>PRODUCTO</th>
                        <th>PRECIO</th>
                        <th>CANTIDAD</th>
                        <th>SUBTOTAL</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => {
                        const product = products.find(
                          (currentProduct) =>
                            currentProduct.id ===
                            item.productId,
                        );

                        if (!product) {
                          return null;
                        }

                        const subtotal =
                          product.precioVenta *
                          item.quantity;

                        return (
                          <tr key={item.productId}>
                            <td>
                              <div className="product-name-cell">
                                <strong>
                                  {product.name}
                                </strong>

                                <span>
                                  {product.id}
                                </span>
                              </div>
                            </td>

                            <td>
                              {formatCurrency(
                                product.precioVenta,
                              )}
                            </td>

                            <td>
                              <input
                                type="number"
                                min="1"
                                max={getAvailableStock(
                                  product,
                                )}
                                step="1"
                                value={item.quantity}
                                onChange={(event) =>
                                  updateQuantity(
                                    item.productId,
                                    Number(
                                      event.target.value,
                                    ),
                                  )
                                }
                                disabled={submitting}
                                style={{
                                  width: "90px",
                                }}
                                aria-label={`Cantidad de ${product.name}`}
                              />
                            </td>

                            <td>
                              <strong>
                                {formatCurrency(
                                  subtotal,
                                )}
                              </strong>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="text-button"
                                onClick={() =>
                                  removeItem(
                                    item.productId,
                                  )
                                }
                                disabled={submitting}
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="products-panel">
              <div className="products-toolbar">
                <div>
                  <strong>Resumen</strong>

                  <span>
                    El pedido se creará inicialmente en
                    estado pendiente.
                  </span>
                </div>

                <div>
                  <span>TOTAL</span>

                  <strong>
                    {formatCurrency(total)}
                  </strong>
                </div>
              </div>

              {error && (
                <div
                  className="form-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="form-actions">
                <Link
                  href="/pedidos"
                  className="secondary-button"
                  aria-disabled={submitting}
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    submitting ||
                    loadingProducts ||
                    items.length === 0
                  }
                >
                  {submitting
                    ? "Creando pedido..."
                    : "Crear pedido"}
                </button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}