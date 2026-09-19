"use client";

import Link from "next/link";
import Brand from "./Brand";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        <Brand />

        <div className="sidebar-section">
          <span className="section-label">
            GESTIÓN
          </span>

          <nav className="navigation">
            <Link
              href="/"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/productos"
              className="nav-item active"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Productos</span>
            </Link>

            <Link
              href="/pedidos"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Pedidos</span>
            </Link>

            <Link
              href="/inventario"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Inventario</span>
            </Link>

            <Link
              href="/clientes"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Clientes</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="section-label">
            ANÁLISIS
          </span>

          <nav className="navigation">
            <Link
              href="/contabilidad"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Contabilidad</span>
            </Link>

            <Link
              href="/reportes"
              className="nav-item"
              onClick={onClose}
            >
              <span className="nav-indicator" />
              <span>Reportes</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />

            <div>
              <strong>
                Sistema operativo
              </strong>

              <span>
                Todos los servicios activos
              </span>
            </div>
          </div>

          <div className="user-card">
            <div className="avatar">
              JP
            </div>

            <div className="user-info">
              <strong>
                Juan Pérez
              </strong>

              <span>
                Administrador
              </span>
            </div>

            <button
              type="button"
              className="user-menu"
              aria-label="Opciones de usuario"
            >
              •••
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="mobile-overlay"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}