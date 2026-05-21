import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { WorkOrder } from "@/types";

function rowToWorkOrder(row: any): WorkOrder {
  return {
    id: row.id,
    number: row.number,
    customerId: row.customer_id,
    serviceId: row.service_id,
    quoteId: row.quote_id ?? undefined,
    address: row.address,
    scheduledAt: row.scheduled_at,
    value: row.value,
    technician: row.technician,
    checklist: JSON.parse(row.checklist),
    photosBefore: JSON.parse(row.photos_before),
    photosAfter: JSON.parse(row.photos_after),
    parts: JSON.parse(row.parts),
    technicalNotes: row.technical_notes ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    paymentStatus: row.payment_status,
    warranty: { active: !!row.warranty_active, until: row.warranty_until },
    publicToken: row.public_token,
    status: row.status,
    timeline: JSON.parse(row.timeline),
  };
}

export const getWorkOrders = createServerFn({ method: "GET" }).handler(async (): Promise<WorkOrder[]> => {
  const rows = db.prepare("SELECT * FROM work_orders ORDER BY scheduled_at DESC").all();
  return rows.map(rowToWorkOrder);
});

export const getWorkOrder = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<WorkOrder | null> => {
    const id = queryKey?.[1];
    if (!id) return null;
    const row = db.prepare("SELECT * FROM work_orders WHERE id = ?").get(id);
    return row ? rowToWorkOrder(row) : null;
  });

export const getWorkOrderByToken = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<WorkOrder | null> => {
    const token = queryKey?.[1];
    if (!token) return null;
    const row = db.prepare("SELECT * FROM work_orders WHERE public_token = ?").get(token);
    return row ? rowToWorkOrder(row) : null;
  });

export const createWorkOrder = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<WorkOrder> => {
    const id = generateId("os");
    const count = (db.prepare("SELECT COUNT(*) as c FROM work_orders").get() as any).c;
    const number = `OS-${String(118 + count + 1).padStart(4, "0")}`;
    const token = `tok-${id}`;
    db.prepare(
      `INSERT INTO work_orders (id, number, customer_id, service_id, quote_id, address, scheduled_at, value, technician, checklist, photos_before, photos_after, parts, technical_notes, payment_method, payment_status, warranty_active, warranty_until, public_token, status, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, number, data.customerId, data.serviceId, data.quoteId ?? null, data.address, data.scheduledAt,
      data.value, data.technician ?? "João", JSON.stringify(data.checklist ?? []), JSON.stringify(data.photosBefore ?? []),
      JSON.stringify(data.photosAfter ?? []), JSON.stringify(data.parts ?? []), data.technicalNotes ?? null,
      data.paymentMethod ?? null, data.paymentStatus ?? "Pendente", data.warranty?.active ? 1 : 0,
      data.warranty?.until ?? null, token, data.status ?? "Nova", JSON.stringify(data.timeline ?? [])
    );
    const row = db.prepare("SELECT * FROM work_orders WHERE id = ?").get(id);
    return rowToWorkOrder(row);
  });

export const updateWorkOrder = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<WorkOrder> => {
    db.prepare(
      `UPDATE work_orders SET customer_id=?, service_id=?, quote_id=?, address=?, scheduled_at=?, value=?, technician=?, checklist=?, photos_before=?, photos_after=?, parts=?, technical_notes=?, payment_method=?, payment_status=?, warranty_active=?, warranty_until=?, status=?, timeline=? WHERE id=?`
    ).run(
      data.customerId, data.serviceId, data.quoteId ?? null, data.address, data.scheduledAt,
      data.value, data.technician, JSON.stringify(data.checklist ?? []), JSON.stringify(data.photosBefore ?? []),
      JSON.stringify(data.photosAfter ?? []), JSON.stringify(data.parts ?? []), data.technicalNotes ?? null,
      data.paymentMethod ?? null, data.paymentStatus, data.warranty?.active ? 1 : 0,
      data.warranty?.until ?? null, data.status, JSON.stringify(data.timeline ?? []), data.id
    );
    const row = db.prepare("SELECT * FROM work_orders WHERE id = ?").get(data.id);
    return rowToWorkOrder(row);
  });

export const deleteWorkOrder = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM work_orders WHERE id = ?").run(data.id);
    return { id: data.id };
  });
