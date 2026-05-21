import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Service } from "@/types";

function rowToService(row: any): Service {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    billing: row.billing,
    averageMinutes: row.average_minutes,
    basePrice: row.base_price,
    defaultComplexity: row.default_complexity,
    needsParts: !!row.needs_parts,
    hasWarranty: !!row.has_warranty,
    warrantyDays: row.warranty_days,
    checklist: JSON.parse(row.checklist),
    customerMessage: row.customer_message ?? "",
    active: !!row.active,
  };
}

export const getServices = createServerFn({ method: "GET" }).handler(async (): Promise<Service[]> => {
  const rows = db.prepare("SELECT * FROM services ORDER BY name").all();
  return rows.map(rowToService);
});

export const getService = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<Service | null> => {
    const id = queryKey?.[1];
    if (!id) return null;
    const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
    return row ? rowToService(row) : null;
  });

export const createService = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Service> => {
    const id = generateId("s");
    db.prepare(
      `INSERT INTO services (id, name, category, billing, average_minutes, base_price, default_complexity, needs_parts, has_warranty, warranty_days, checklist, customer_message, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, data.name, data.category, data.billing, data.averageMinutes, data.basePrice,
      data.defaultComplexity, data.needsParts ? 1 : 0, data.hasWarranty ? 1 : 0, data.warrantyDays,
      JSON.stringify(data.checklist ?? []), data.customerMessage, data.active ? 1 : 0
    );
    const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
    return rowToService(row);
  });

export const updateService = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Service> => {
    db.prepare(
      `UPDATE services SET name=?, category=?, billing=?, average_minutes=?, base_price=?, default_complexity=?, needs_parts=?, has_warranty=?, warranty_days=?, checklist=?, customer_message=?, active=? WHERE id=?`
    ).run(
      data.name, data.category, data.billing, data.averageMinutes, data.basePrice,
      data.defaultComplexity, data.needsParts ? 1 : 0, data.hasWarranty ? 1 : 0, data.warrantyDays,
      JSON.stringify(data.checklist ?? []), data.customerMessage, data.active ? 1 : 0, data.id
    );
    const row = db.prepare("SELECT * FROM services WHERE id = ?").get(data.id);
    return rowToService(row);
  });

export const deleteService = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM services WHERE id = ?").run(data.id);
    return { id: data.id };
  });
