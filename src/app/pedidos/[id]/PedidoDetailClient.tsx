"use client";

import Link from "next/link";
import { useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Header from "../../../components/layout/Header";

interface Order {
  id: string;
  userId: string;
  status:
    | "PENDING"
    | "READY_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  costo: number;
  subtotal: number;
}

interface PedidoDetailClientProps {
  order: Order;
  items: OrderItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(status: Order["status"]) {
  switch (status) {
    case "PENDING":
      return "Pendiente";

    case "READY_FOR_DELIVERY":
      return "Listo para entrega";

    case "COMPLETED":
      return "Completado";

    case "CANCELLED":
      return "Cancelado";

    default:
      return status;
  }
}

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "PENDING":
      return "product-status-critical";

    case "READY_FOR_DELIVERY":
      return "product-status-available";

    case "COMPLETED":
      return "product-status-available";

    case "CANCELLED":
      return "product-status-empty";

    default:
      return "";
  }
}

export default function PedidoDetailClient({
  order,
  items,
}: PedidoDetailClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentStatus, setCurrentStatus] =
    useState<Order["status"]>(order.status);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleStatusAction(
    action: "ready" | "complete" | "cancel",
  ) {
    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/orders/${order.id}/${action}`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "No se pudo actualizar el pedido.",
        );
      }

      if (action === "ready") {
        setCurrentStatus("READY_FOR_DELIVERY");
      }

      if (action === "complete") {
        setCurrentStatus("COMPLETED");
      }

      if (action === "cancel") {
        setCurrentStatus("CANCELLED");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el pedido.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  const statusLabel =
    getStatusLabel(currentStatus);

  const statusClass =
    getStatusClass(currentStatus);

  const canMarkReady =
    currentStatus === "PENDING";

  const canComplete =
    currentStatus === "READY_FOR_DELIVERY";

  const canCancel =
    currentStatus === "PENDING" ||
    currentStatus === "READY_FOR_DELIVERY";

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        <Header
          title="Pedido"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="content">
          <section className="page-heading">
            <div>
              <span className="eyebrow">
                GESTIÓN DE PEDIDOS
              </span>

              <h1>Pedido {order.id}</h1>

              <p>
                Detalle, productos y estado del pedido.
              </p>
            </div>

            <Link
              href="/pedidos"
              className="secondary-button"
            >
              ← Volver a pedidos
            </Link>
          </section>

          <section className="product-stats">
            <article className="product-stat-card">
              <span>CLIENTE</span>
              <strong>{order.userId}</strong>
            </article>

            <article className="product-stat-card">
              <span>TOTAL</span>
              <strong>
                {formatCurrency(order.totalAmount)}
              </strong>
            </article>

            <article className="product-stat-card">
              <span>ESTADO</span>

              <strong>
                <span
                  className={`product-status ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </strong>
            </article>

            <article className="product-stat-card">
              <span>FECHA</span>

              <strong>
                {formatDate(order.createdAt)}
              </strong>
            </article>
          </section>

          {error && (
            <div className="product-error">
              {error}
            </div>
          )}

          <section className="panel products-panel">
            <div className="products-result">
              <span>
                Productos del pedido
              </span>
            </div>

            {items.length === 0 ? (
              <div className="products-empty">
                <strong>
                  Este pedido no contiene productos.
                </strong>
              </div>
            ) : (
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>PRODUCTO</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Link
                            href={`/productos/${item.productId}`}
                            className="product-link"
                          >
                            <strong>
                              {item.productName}
                            </strong>

                            <span>
                              {item.productId}
                            </span>
                          </Link>
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          {formatCurrency(item.price)}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              item.subtotal,
                            )}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="product-detail-status">
              <span>
                Total del pedido
              </span>

              <strong>
                {formatCurrency(order.totalAmount)}
              </strong>
            </div>
          </section>

          <section className="panel products-panel">
            <div className="products-result">
              <span>
                Acciones del pedido
              </span>
            </div>

            <div className="order-actions">
              {canMarkReady && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    handleStatusAction("ready")
                  }
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Actualizando..."
                    : "Marcar como listo"}
                </button>
              )}

              {canComplete && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    handleStatusAction("complete")
                  }
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Actualizando..."
                    : "Completar pedido"}
                </button>
              )}

              {canCancel && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleStatusAction("cancel")
                  }
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Actualizando..."
                    : "Cancelar pedido"}
                </button>
              )}

              {!canMarkReady &&
                !canComplete &&
                !canCancel && (
                  <span>
                    Este pedido no tiene acciones
                    disponibles.
                  </span>
                )}
            </div>
          </section>

          <section className="panel products-panel">
            <div className="products-result">
              <span>
                Información del pedido
              </span>
            </div>

            <div className="product-detail-grid">
              <div className="product-detail-item">
                <span>ID DEL PEDIDO</span>
                <strong>{order.id}</strong>
              </div>

              <div className="product-detail-item">
                <span>USUARIO</span>
                <strong>{order.userId}</strong>
              </div>

              <div className="product-detail-item">
                <span>CREADO</span>
                <strong>
                  {formatDate(order.createdAt)}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>ÚLTIMA ACTUALIZACIÓN</span>
                <strong>
                  {formatDate(order.updatedAt)}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>COMPLETADO</span>
                <strong>
                  {order.completedAt
                    ? formatDate(
                        order.completedAt,
                      )
                    : "Pendiente"}
                </strong>
              </div>

              <div className="product-detail-item">
                <span>ESTADO ACTUAL</span>
                <strong>
                  {statusLabel}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}