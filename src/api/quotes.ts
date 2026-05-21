import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Quote } from "@/types";

function rowToQuote(row: any): Quote {
  return {
    id: row.id,
    number: row.number,
    customerId: row.customer_id,
    serviceId: row.service_id,
    problem: row.problem,
    billing: row.billing,
    complexity: row.complexity,
    urgency: row.urgency,
    estimatedMinutes: row.estimated_minutes,
    travelFee: row.travel_fee,
    partsCost: row.parts_cost,
    partsMargin: row.parts_margin,
    discount: row.discount,
    values: { min: row.value_min, recommended: row.value_recommended, premium: row.value_premium },
    finalValue: row.final_value,
    warranty: { enabled: !!row.warranty_enabled, days: row.warranty_days, coverage: row.warranty_coverage },
    status: row.status,
    validityDate: row.validity_date,
    publicToken: row.public_token,
    internalNotes: row.internal_notes ?? undefined,
    createdAt: row.created_at,
  };
}

export const getQuotes = createServerFn({ method: "GET" }).handler(async (): Promise<Quote[]> => {
  const rows = db.prepare("SELECT * FROM quotes ORDER BY created_at DESC").all();
  return rows.map(rowToQuote);
});

export const getQuote = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<Quote | null> => {
    const id = queryKey?.[1];
    if (!id) return null;
    const row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(id);
    return row ? rowToQuote(row) : null;
  });

export const getQuoteByToken = createServerFn({ method: "GET" })
  .handler(async ({ queryKey }: any): Promise<Quote | null> => {
    const token = queryKey?.[1];
    if (!token) return null;
    const row = db.prepare("SELECT * FROM quotes WHERE public_token = ?").get(token);
    return row ? rowToQuote(row) : null;
  });

export const createQuote = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Quote> => {
    const id = generateId("q");
    const count = (db.prepare("SELECT COUNT(*) as c FROM quotes").get() as any).c;
    const number = `ORC-${String(240 + count + 1).padStart(4, "0")}`;
    const token = `tok-${id}`;
    db.prepare(
      `INSERT INTO quotes (id, number, customer_id, service_id, problem, billing, complexity, urgency, estimated_minutes, travel_fee, parts_cost, parts_margin, discount, value_min, value_recommended, value_premium, final_value, warranty_enabled, warranty_days, warranty_coverage, status, validity_date, public_token, internal_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, number, data.customerId, data.serviceId, data.problem, data.billing, data.complexity, data.urgency,
      data.estimatedMinutes, data.travelFee, data.partsCost, data.partsMargin, data.discount,
      data.values.min, data.values.recommended, data.values.premium, data.finalValue,
      data.warranty?.enabled ? 1 : 0, data.warranty?.days ?? 90, data.warranty?.coverage ?? "Mão de obra",
      data.status ?? "Rascunho", data.validityDate, token, data.internalNotes ?? null
    );
    const row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(id);
    return rowToQuote(row);
  });

export const updateQuote = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Quote> => {
    db.prepare(
      `UPDATE quotes SET customer_id=?, service_id=?, problem=?, billing=?, complexity=?, urgency=?, estimated_minutes=?, travel_fee=?, parts_cost=?, parts_margin=?, discount=?, value_min=?, value_recommended=?, value_premium=?, final_value=?, warranty_enabled=?, warranty_days=?, warranty_coverage=?, status=?, validity_date=?, internal_notes=? WHERE id=?`
    ).run(
      data.customerId, data.serviceId, data.problem, data.billing, data.complexity, data.urgency,
      data.estimatedMinutes, data.travelFee, data.partsCost, data.partsMargin, data.discount,
      data.values.min, data.values.recommended, data.values.premium, data.finalValue,
      data.warranty?.enabled ? 1 : 0, data.warranty?.days ?? 90, data.warranty?.coverage ?? "Mão de obra",
      data.status, data.validityDate, data.internalNotes ?? null, data.id
    );
    const row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(data.id);
    return rowToQuote(row);
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM quotes WHERE id = ?").run(data.id);
    return { id: data.id };
  });
