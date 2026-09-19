"use client";

import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const orders = [
  {
    id: "#AQ-1048",
    client: "Distribuidora Central",
    date: "18 Sep 2026",
    amount: "$184.500",
    status: "Pendiente",
  },
  {
    id: "#AQ-1047",
    client: "Comercial San Martín",
    date: "18 Sep 2026",
    amount: "$92.800",
    status: "Listo para entrega",
  },
  {
    id: "#AQ-1046",
    client: "Almacén Norte",
    date: "17 Sep 2026",
    amount: "$236.200",
    status: "Completado",
  },
  {
    id: "#AQ-1045",
    client: "Distribuciones Córdoba",
    date: "17 Sep 2026",
    amount: "$74.300",
    status: "Completado",
  },
];

const products = [
  {
    name: "Producto Premium",
    sku: "AQ-001",
    available: 4,
    minimum: 10,
  },
  {
    name: "Línea Especial",
    sku: "AQ-014",
    available: 7,
    minimum: 12,
  },
  {
    name: "Producto Clásico",
    sku: "AQ-023",
    available: 0,
    minimum: 8,
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

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
      title="Dashboard"
      onMenuClick={() =>
        setSidebarOpen(true)
      }
    />

        <div className="content">
          {/* ==========================================
              WELCOME
          ========================================== */}

          <section className="welcome">
            <div>
              <span className="eyebrow">
                RESUMEN OPERATIVO
              </span>

              <h1>
                Buenos días, Juan.
              </h1>

              <p>
                Este es el estado general de AQ
                Distribuciones.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
            >
              <span>+</span>
              Nuevo pedido
            </button>
          </section>


          {/* ==========================================
              METRICS
          ========================================== */}

          <section className="metrics-grid">

            <article className="metric-card">
              <div className="metric-header">
                <span>
                  VENTAS DEL MES
                </span>

                <span className="metric-symbol">
                  $
                </span>
              </div>

              <strong className="metric-value">
                $2.847.500
              </strong>

              <div className="metric-footer">
                <span className="positive">
                  +12,8%
                </span>

                <span>
                  vs. mes anterior
                </span>
              </div>
            </article>


            <article className="metric-card">
              <div className="metric-header">
                <span>
                  PEDIDOS
                </span>

                <span className="metric-symbol">
                  #
                </span>
              </div>

              <strong className="metric-value">
                148
              </strong>

              <div className="metric-footer">
                <span className="positive">
                  +8,4%
                </span>

                <span>
                  este mes
                </span>
              </div>
            </article>


            <article className="metric-card">
              <div className="metric-header">
                <span>
                  PRODUCTOS
                </span>

                <span className="metric-symbol">
                  ◌
                </span>
              </div>

              <strong className="metric-value">
                324
              </strong>

              <div className="metric-footer">
                <span>
                  316
                </span>

                <span>
                  con stock disponible
                </span>
              </div>
            </article>


            <article className="metric-card metric-alert">
              <div className="metric-header">
                <span>
                  STOCK CRÍTICO
                </span>

                <span className="metric-symbol">
                  !
                </span>
              </div>

              <strong className="metric-value">
                8
              </strong>

              <div className="metric-footer">
                <span className="warning">
                  Requieren atención
                </span>
              </div>
            </article>

          </section>


          {/* ==========================================
              ORDERS + STOCK
          ========================================== */}

          <section className="dashboard-grid">

            <article className="panel orders-panel">

              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    ACTIVIDAD
                  </span>

                  <h2>
                    Pedidos recientes
                  </h2>
                </div>

                <button
                  type="button"
                  className="text-button"
                >
                  Ver todos
                  <span>→</span>
                </button>
              </div>


              <div className="table-wrapper">
                <table>

                  <thead>
                    <tr>
                      <th>PEDIDO</th>
                      <th>CLIENTE</th>
                      <th>FECHA</th>
                      <th>IMPORTE</th>
                      <th>ESTADO</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>

                        <td>
                          <strong>
                            {order.id}
                          </strong>
                        </td>

                        <td>
                          {order.client}
                        </td>

                        <td>
                          {order.date}
                        </td>

                        <td>
                          <strong>
                            {order.amount}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`status status-${order.status
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {order.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </article>


            <article className="panel stock-panel">

              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    INVENTARIO
                  </span>

                  <h2>
                    Stock crítico
                  </h2>
                </div>

                <button
                  type="button"
                  className="text-button"
                >
                  Inventario
                  <span>→</span>
                </button>
              </div>


              <div className="stock-list">

                {products.map((product) => {

                  const percentage =
                    Math.min(
                      (product.available /
                        product.minimum) *
                        100,
                      100
                    );

                  return (
                    <div
                      className="stock-item"
                      key={product.sku}
                    >

                      <div className="stock-info">

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.sku}
                          </span>
                        </div>

                        <strong className="stock-number">
                          {product.available}
                        </strong>

                      </div>


                      <div className="stock-bar">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>


                      <div className="stock-meta">

                        <span>
                          Mínimo:{" "}
                          {product.minimum}
                        </span>

                        <span>
                          {product.available === 0
                            ? "Agotado"
                            : "Stock bajo"}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

            </article>

          </section>


          {/* ==========================================
              CHART + QUICK ACTIONS
          ========================================== */}

          <section className="bottom-grid">

            <article className="panel chart-panel">

              <div className="panel-header">

                <div>
                  <span className="eyebrow">
                    RENDIMIENTO
                  </span>

                  <h2>
                    Ventas
                  </h2>
                </div>

                <button
                  type="button"
                  className="period-selector"
                >
                  Últimos 6 meses
                  <span>⌄</span>
                </button>

              </div>


              <div className="chart">

                <div className="chart-y">
                  <span>$500k</span>
                  <span>$400k</span>
                  <span>$300k</span>
                  <span>$200k</span>
                  <span>$100k</span>
                  <span>$0</span>
                </div>


                <div className="chart-area">

                  <div className="chart-grid-line line-1" />
                  <div className="chart-grid-line line-2" />
                  <div className="chart-grid-line line-3" />
                  <div className="chart-grid-line line-4" />
                  <div className="chart-grid-line line-5" />


                  <svg
                    className="chart-svg"
                    viewBox="0 0 700 230"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >

                    <defs>

                      <linearGradient
                        id="goldArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#c8a45d"
                          stopOpacity="0.25"
                        />

                        <stop
                          offset="100%"
                          stopColor="#c8a45d"
                          stopOpacity="0"
                        />

                      </linearGradient>

                    </defs>


                    <path
                      d="M0 185 C80 172, 90 150, 140 160 C200 172, 215 120, 270 132 C330 146, 340 105, 390 112 C450 121, 475 78, 520 91 C575 106, 600 48, 700 55 L700 230 L0 230 Z"
                      fill="url(#goldArea)"
                    />


                    <path
                      d="M0 185 C80 172, 90 150, 140 160 C200 172, 215 120, 270 132 C330 146, 340 105, 390 112 C450 121, 475 78, 520 91 C575 106, 600 48, 700 55"
                      fill="none"
                      stroke="#c8a45d"
                      strokeWidth="3"
                    />

                  </svg>


                  <div className="chart-months">
                    <span>Abr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Ago</span>
                    <span>Sep</span>
                  </div>

                </div>

              </div>

            </article>


            <article className="panel quick-panel">

              <div className="panel-header">

                <div>
                  <span className="eyebrow">
                    ACCESOS
                  </span>

                  <h2>
                    Acciones rápidas
                  </h2>
                </div>

              </div>


              <div className="quick-actions">

                <button type="button">
                  <span className="quick-letter">
                    +
                  </span>

                  <div>
                    <strong>
                      Nuevo pedido
                    </strong>

                    <small>
                      Registrar una nueva venta
                    </small>
                  </div>

                  <span className="arrow">
                    →
                  </span>
                </button>


                <button type="button">
                  <span className="quick-letter">
                    P
                  </span>

                  <div>
                    <strong>
                      Agregar producto
                    </strong>

                    <small>
                      Incorporar al catálogo
                    </small>
                  </div>

                  <span className="arrow">
                    →
                  </span>
                </button>


                <button type="button">
                  <span className="quick-letter">
                    I
                  </span>

                  <div>
                    <strong>
                      Ver inventario
                    </strong>

                    <small>
                      Consultar existencias
                    </small>
                  </div>

                  <span className="arrow">
                    →
                  </span>
                </button>


                <button type="button">
                  <span className="quick-letter">
                    R
                  </span>

                  <div>
                    <strong>
                      Generar reporte
                    </strong>

                    <small>
                      Analizar resultados
                    </small>
                  </div>

                  <span className="arrow">
                    →
                  </span>
                </button>

              </div>

            </article>

          </section>

        </div>

      </main>

    </div>
  );
}