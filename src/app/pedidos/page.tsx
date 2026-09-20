import { listOrders } from "../../modules/orders/list";
import PedidosClient from "./PedidosClient";

export default async function PedidosPage() {
  const pedidos = await listOrders();

  const serializablePedidos = pedidos.map(
    ({
      createdAt,
      updatedAt,
      completedAt,
      ...pedido
    }) => ({
      ...pedido,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      completedAt: completedAt
        ? completedAt.toISOString()
        : null,
    }),
  );

  return (
    <PedidosClient
      initialPedidos={serializablePedidos}
    />
  );
}