import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Followup } from "@/types";

function rowToFollowup(row: any): Followup {
  return {
    id: row.id,
    customerId: row.customer_id,
    workOrderId: row.work_order_id,
    kind: row.kind,
    dueDate: row.due_date,
    done: !!row.done,
    message: row.message,
  };
}

export const getFollowups = createServerFn({ method: "GET" }).handler(async (): Promise<Followup[]> => {
  const rows = db.prepare("SELECT * FROM followups ORDER BY due_date").all();
  return rows.map(rowToFollowup);
});

export const createFollowup = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Followup> => {
    const id = generateId("f");
    db.prepare(
      `INSERT INTO followups (id, customer_id, work_order_id, kind, due_date, done, message) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, data.customerId, data.workOrderId, data.kind, data.dueDate, data.done ? 1 : 0, data.message);
    const row = db.prepare("SELECT * FROM followups WHERE id = ?").get(id);
    return rowToFollowup(row);
  });

export const updateFollowup = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Followup> => {
    db.prepare(
      `UPDATE followups SET customer_id=?, work_order_id=?, kind=?, due_date=?, done=?, message=? WHERE id=?`
    ).run(data.customerId, data.workOrderId, data.kind, data.dueDate, data.done ? 1 : 0, data.message, data.id);
    const row = db.prepare("SELECT * FROM followups WHERE id = ?").get(data.id);
    return rowToFollowup(row);
  });

export const deleteFollowup = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM followups WHERE id = ?").run(data.id);
    return { id: data.id };
  });
