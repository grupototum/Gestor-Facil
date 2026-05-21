import { createServerFn } from "@tanstack/react-start";
import { db, generateId } from "@/db";
import type { Payment, Expense } from "@/types";

function rowToPayment(row: any): Payment {
  return {
    id: row.id,
    workOrderId: row.work_order_id,
    customerId: row.customer_id,
    amount: row.amount,
    method: row.method,
    date: row.date,
  };
}

function rowToExpense(row: any): Expense {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    amount: row.amount,
    date: row.date,
  };
}

// Payments
export const getPayments = createServerFn({ method: "GET" }).handler(async (): Promise<Payment[]> => {
  const rows = db.prepare("SELECT * FROM payments ORDER BY date DESC").all();
  return rows.map(rowToPayment);
});

export const createPayment = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Payment> => {
    const id = generateId("p");
    db.prepare(
      `INSERT INTO payments (id, work_order_id, customer_id, amount, method, date) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, data.workOrderId, data.customerId, data.amount, data.method, data.date ?? new Date().toISOString());
    const row = db.prepare("SELECT * FROM payments WHERE id = ?").get(id);
    return rowToPayment(row);
  });

export const deletePayment = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM payments WHERE id = ?").run(data.id);
    return { id: data.id };
  });

// Expenses
export const getExpenses = createServerFn({ method: "GET" }).handler(async (): Promise<Expense[]> => {
  const rows = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
  return rows.map(rowToExpense);
});

export const createExpense = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Expense> => {
    const id = generateId("e");
    db.prepare(
      `INSERT INTO expenses (id, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`
    ).run(id, data.category, data.description, data.amount, data.date ?? new Date().toISOString());
    const row = db.prepare("SELECT * FROM expenses WHERE id = ?").get(id);
    return rowToExpense(row);
  });

export const deleteExpense = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<{ id: string }> => {
    db.prepare("DELETE FROM expenses WHERE id = ?").run(data.id);
    return { id: data.id };
  });
