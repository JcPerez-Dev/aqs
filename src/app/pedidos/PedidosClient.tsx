"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

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

interface PedidosClientProps {
  initialPedidos: Order[];
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
  }).format(new Date(value));
}

function getStatusLabel(status: Order["status"]) {
  switch (status) {
    case "PENDING":
      return "Pendiente";

    case "READY_FOR_DELIVERY":
      return "Listo";

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

export default function PedidosClient({
  initialPedidos,
}: PedidosClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function refreshPedidos() {
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los pedidos.");
      }

      const data: Order[] = await response.json();

      setPedidos(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los pedidos.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  const pedidosFiltrados = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return pedidos.filter((pedido) => {
      const matchesSearch =
        normalizedSearch === "" ||
        pedido.id.toLowerCase().includes(normalizedSearch) ||
        pedido.userId.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" ||
        pedido.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pedidos, search, statusFilter]);

  const totalPedidos = pedidos.length;

  const pendientes = pedidos.filter(
    (pedido) => pedido.status === "PENDING",
  ).length;

  const listos = pedidos.filter(
    (pedido) => pedido.status === "READY_FOR_DELIVERY",
  ).length;

  const completados = pedidos.filter(
    (pedido) => pedido.status === "COMPLETED",
  ).length;

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        <Header
          title="Pedidos"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="content">
          <section className="page-heading">
            <div>
              <span className="eyebrow">
                GESTIÓN DE PEDIDOS
              </span>

              <h1>Pedidos</h1>

              <p>
                Consulta y seguimiento de los pedidos
                registrados.
              </p>
            </div>

            <Link
  href="/pedidos/nuevo"
  className="primary-button"
>
  Nuevo pedido
</Link>
          </section>

          <section className="product-stats">
            <article className="product-stat-card">
              <span>TOTAL DE PEDIDOS</span>
              <strong>{totalPedidos}</strong>
            </article>

            <article className="product-stat-card">
              <span>PENDIENTES</span>
              <strong>{pendientes}</strong>
            </article>

            <article className="product-stat-card">
              <span>LISTOS</span>
              <strong>{listos}</strong>
            </article>

            <article className="product-stat-card">
              <span>COMPLETADOS</span>
              <strong>{completados}</strong>
            </article>
          </section>

          <section className="panel products-panel">
            <div className="products-toolbar">
              <div className="product-search">
                <input
                  type="search"
                  placeholder="Buscar por pedido o cliente..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Buscar pedidos"
                />
              </div>

              <div className="product-filters">
                <select
                  className="filter-button"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  aria-label="Filtrar por estado"
                >
                  <option value="Todos">
                    Todos los estados
                  </option>

                  <option value="PENDING">
                    Pendiente
                  </option>

                  <option value="READY_FOR_DELIVERY">
                    Listo
                  </option>

                  <option value="COMPLETED">
                    Completado
                  </option>

                  <option value="CANCELLED">
                    Cancelado
                  </option>
                </select>

                <button
                  type="button"
                  className="refresh-button"
                  onClick={refreshPedidos}
                  disabled={refreshing}
                >
                  {refreshing
                    ? "Actualizando..."
                    : "Actualizar"}
                </button>
              </div>
            </div>

            {error && (
              <div className="product-error">
                {error}
              </div>
            )}

            <div className="products-result">
              <span>
                Mostrando {pedidosFiltrados.length} de{" "}
                {pedidos.length} pedidos
              </span>
            </div>

            {pedidosFiltrados.length === 0 ? (
              <div className="products-empty">
                <strong>
                  No se encontraron pedidos
                </strong>

                <span>
                  Probá modificando la búsqueda o el
                  filtro seleccionado.
                </span>
              </div>
            ) : (
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>PEDIDO</th>
                      <th>CLIENTE</th>
                      <th>ESTADO</th>
                      <th>TOTAL</th>
                      <th>FECHA</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>
                          <Link
                            href={`/pedidos/${pedido.id}`}
                            className="product-link"
                          >
                            <strong>
                              {pedido.id}
                            </strong>
                          </Link>
                        </td>

                        <td>
                          <strong>
                            {pedido.userId}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`product-status ${getStatusClass(
                              pedido.status,
                            )}`}
                          >
                            {getStatusLabel(
                              pedido.status,
                            )}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              pedido.totalAmount,
                            )}
                          </strong>
                        </td>

                        <td>
                          {formatDate(
                            pedido.createdAt,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}