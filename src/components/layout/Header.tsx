"use client";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({
  title,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <span />
        <span />
        <span />
      </button>

      <div className="breadcrumb">
        <span>AQ Distribuciones</span>
        <b>/</b>
        <strong>{title}</strong>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="notification-button"
          aria-label="Notificaciones"
        >
          <span className="notification-dot" />
          <span className="notification-icon">
            ○
          </span>
        </button>

        <div className="topbar-date">
          <span>VIERNES</span>
          <strong>18 SEP 2026</strong>
        </div>
      </div>
    </header>
  );
}