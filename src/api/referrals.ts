import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Referral } from "@/types";

function rowToReferral(row: any): Referral {
  return {
    id: row.id,
    fromCustomerId: row.from_customer_id,
    name: row.name,
    whatsapp: row.whatsapp,
    serviceType: row.service_type,
    note: row.note ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export const getReferrals = createServerFn({ method: "GET" }).handler(async (): Promise<Referral[]> => {
  const rows = db.prepare("SELECT * FROM referrals ORDER BY created_at DESC").all();
  return rows.map(rowToReferral);
});

export const createReferral = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Referral> => {
    const id = generateId("r");
    db.prepare(
      `INSERT INTO referrals (id, from_customer_id, name, whatsapp, service_type, note, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))`
    ).run(id, data.fromCustomerId, data.name, data.whatsapp, data.serviceType, data.note ?? null, data.status ?? "Nova");
    const row = db.prepare("SELECT * FROM referrals WHERE id = ?").get(id);
    return rowToReferral(row);
  });

export const updateReferral = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Referral> => {
    db.prepare(
      `UPDATE referrals SET from_customer_id=?, name=?, whatsapp=?, service_type=?, note=?, status=? WHERE id=?`
    ).run(data.fromCustomerId, data.name, data.whatsapp, data.serviceType, data.note ?? null, data.status, data.id);
    const row = db.prepare("SELECT * FROM referrals WHERE id = ?").get(data.id);
    return rowToReferral(row);
  });

export const deleteReferral = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM referrals WHERE id = ?").run(data.id);
    return { id: data.id };
  });
