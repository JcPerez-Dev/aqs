import { notFound } from "next/navigation";

import { getOrder } from "../../../modules/orders/get";
import PedidoDetailClient from "./PedidoDetailClient";

interface PedidoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PedidoDetailPage({
  params,
}: PedidoDetailPageProps) {
  const { id } = await params;

  let result;

  try {
    result = await getOrder(id);
  } catch {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const serializableOrder = {
    ...result.order,
    createdAt: result.order.createdAt.toISOString(),
    updatedAt: result.order.updatedAt.toISOString(),
    completedAt: result.order.completedAt
      ? result.order.completedAt.toISOString()
      : null,
  };

  const serializableItems = result.items.map((item) => ({
    ...item,
  }));

  return (
    <PedidoDetailClient
      order={serializableOrder}
      items={serializableItems}
    />
  );
}