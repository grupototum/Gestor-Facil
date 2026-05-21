import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Customer } from "@/types";

function rowToCustomer(row: any): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email ?? undefined,
    neighborhood: row.neighborhood,
    address: row.address ?? undefined,
    type: row.type,
    origin: row.origin,
    notes: row.notes ?? undefined,
    totalSpent: row.total_spent,
    serviceCount: row.service_count,
    referralsMade: row.referrals_made,
    createdAt: row.created_at,
  };
}

export const getCustomers = createServerFn({ method: "GET" }).handler(async (): Promise<Customer[]> => {
  const rows = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
  return rows.map(rowToCustomer);
});

export const getCustomer = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<Customer | null> => {
    const id = queryKey?.[1];
    if (!id) return null;
    const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return row ? rowToCustomer(row) : null;
  });

export const createCustomer = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Customer> => {
    const id = generateId("c");
    db.prepare(
      `INSERT INTO customers (id, name, phone, whatsapp, email, neighborhood, address, type, origin, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, data.name, data.phone, data.whatsapp, data.email ?? null,
      data.neighborhood, data.address ?? null, data.type, data.origin, data.notes ?? null
    );
    const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return rowToCustomer(row);
  });

export const updateCustomer = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Customer> => {
    db.prepare(
      `UPDATE customers SET name=?, phone=?, whatsapp=?, email=?, neighborhood=?, address=?, type=?, origin=?, notes=? WHERE id=?`
    ).run(
      data.name, data.phone, data.whatsapp, data.email ?? null,
      data.neighborhood, data.address ?? null, data.type, data.origin, data.notes ?? null, data.id
    );
    const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(data.id);
    return rowToCustomer(row);
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM customers WHERE id = ?").run(data.id);
    return { id: data.id };
  });
