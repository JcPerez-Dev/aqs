"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../../components/layout/Header";
import Sidebar from "../../../components/layout/Sidebar";

export default function NuevoProductoClient() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [costo, setCosto] = useState("");
  const [stockReal, setStockReal] = useState("0");
  const [stockMinimo, setStockMinimo] = useState("0");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description.trim() || null,
          precioVenta: Number(precioVenta),
          costo: Number(costo),
          stockReal: Number(stockReal),
          stockMinimo: Number(stockMinimo),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "No se pudo crear el producto.",
        );
      }

      router.push("/productos");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el producto.",
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
          title="Nuevo producto"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">PRODUCTOS</span>
              <h1>Nuevo producto</h1>
              <p>
                Registrá un nuevo producto en el catálogo de AQ
                Distribuciones.
              </p>
            </div>
          </div>

          <section className="products-panel">
            <div className="products-toolbar">
              <div>
                <strong>Datos del producto</strong>
                <span>
                  Completá la información para registrar el producto.
                </span>
              </div>

              <Link
                href="/productos"
                className="secondary-button"
              >
                Volver a productos
              </Link>
            </div>

            <form
              onSubmit={handleSubmit}
              className="product-form"
            >
              <div className="form-grid">
                <div className="form-field form-field-full">
                  <label htmlFor="name">
                    Nombre <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Ej. Aceite de oliva 500 ml"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="description">
                    Descripción
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Descripción del producto..."
                    rows={4}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="precioVenta">
                    Precio de venta <span>*</span>
                  </label>

                  <input
                    id="precioVenta"
                    name="precioVenta"
                    type="number"
                    min="0"
                    step="0.01"
                    value={precioVenta}
                    onChange={(event) =>
                      setPrecioVenta(event.target.value)
                    }
                    placeholder="0.00"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="costo">
                    Costo <span>*</span>
                  </label>

                  <input
                    id="costo"
                    name="costo"
                    type="number"
                    min="0"
                    step="0.01"
                    value={costo}
                    onChange={(event) =>
                      setCosto(event.target.value)
                    }
                    placeholder="0.00"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="stockReal">
                    Stock inicial
                  </label>

                  <input
                    id="stockReal"
                    name="stockReal"
                    type="number"
                    min="0"
                    step="1"
                    value={stockReal}
                    onChange={(event) =>
                      setStockReal(event.target.value)
                    }
                    disabled={submitting}
                  />

                  <small>
                    Cantidad disponible físicamente al crear el
                    producto.
                  </small>
                </div>

                <div className="form-field">
                  <label htmlFor="stockMinimo">
                    Stock mínimo
                  </label>

                  <input
                    id="stockMinimo"
                    name="stockMinimo"
                    type="number"
                    min="0"
                    step="1"
                    value={stockMinimo}
                    onChange={(event) =>
                      setStockMinimo(event.target.value)
                    }
                    disabled={submitting}
                  />

                  <small>
                    Nivel a partir del cual el producto se considera
                    crítico.
                  </small>
                </div>
              </div>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="form-actions">
                <Link
                  href="/productos"
                  className="secondary-button"
                  aria-disabled={submitting}
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Guardando..."
                    : "Guardar producto"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}