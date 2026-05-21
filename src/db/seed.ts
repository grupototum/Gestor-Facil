import { db, generateId } from "./index";
import {
  mockCompany,
  mockCustomers,
  mockServices,
  mockPricing,
  mockQuotes,
  mockWorkOrders,
  mockPayments,
  mockExpenses,
  mockProtocols,
  mockChecklists,
  mockPOPs,
  mockSLAs,
  mockMessages,
  mockReferrals,
  mockFollowups,
} from "@/data";

export function seedDatabase() {
  const tx = db.transaction(() => {
    // Company
    const hasCompany = db.prepare("SELECT 1 FROM company LIMIT 1").get();
    if (!hasCompany) {
      db.prepare(
        `INSERT INTO company (id, name, tagline, whatsapp, phone, instagram, google_profile, region, hours, primary_color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        mockCompany.id,
        mockCompany.name,
        mockCompany.tagline ?? null,
        mockCompany.whatsapp,
        mockCompany.phone ?? null,
        mockCompany.instagram ?? null,
        mockCompany.googleProfile ?? null,
        mockCompany.region,
        mockCompany.hours,
        mockCompany.primaryColor
      );
    }

    // Customers
    for (const c of mockCustomers) {
      const exists = db.prepare("SELECT 1 FROM customers WHERE id = ?").get(c.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO customers (id, name, phone, whatsapp, email, neighborhood, address, type, origin, notes, total_spent, service_count, referrals_made, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          c.id, c.name, c.phone, c.whatsapp, c.email ?? null, c.neighborhood, c.address ?? null,
          c.type, c.origin, c.notes ?? null, c.totalSpent, c.serviceCount, c.referralsMade, c.createdAt
        );
      }
    }

    // Services
    for (const s of mockServices) {
      const exists = db.prepare("SELECT 1 FROM services WHERE id = ?").get(s.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO services (id, name, category, billing, average_minutes, base_price, default_complexity, needs_parts, has_warranty, warranty_days, checklist, customer_message, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          s.id, s.name, s.category, s.billing, s.averageMinutes, s.basePrice, s.defaultComplexity,
          s.needsParts ? 1 : 0, s.hasWarranty ? 1 : 0, s.warrantyDays,
          JSON.stringify(s.checklist), s.customerMessage, s.active ? 1 : 0
        );
      }
    }

    // Pricing
    const hasPricing = db.prepare("SELECT 1 FROM pricing_settings LIMIT 1").get();
    if (!hasPricing) {
      db.prepare(
        `INSERT INTO pricing_settings (id, hour_rate, visit_fee, default_margin, warranty_days, quote_validity_days, urgency_fast, urgency_emergency, urgency_after_hours)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        mockPricing.hourRate, mockPricing.visitFee, mockPricing.defaultMargin,
        mockPricing.warrantyDays, mockPricing.quoteValidityDays,
        mockPricing.urgencyFast, mockPricing.urgencyEmergency, mockPricing.urgencyAfterHours
      );
    }

    // Quotes
    for (const q of mockQuotes) {
      const exists = db.prepare("SELECT 1 FROM quotes WHERE id = ?").get(q.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO quotes (id, number, customer_id, service_id, problem, billing, complexity, urgency, estimated_minutes, travel_fee, parts_cost, parts_margin, discount, value_min, value_recommended, value_premium, final_value, warranty_enabled, warranty_days, warranty_coverage, status, validity_date, public_token, internal_notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          q.id, q.number, q.customerId, q.serviceId, q.problem, q.billing, q.complexity, q.urgency,
          q.estimatedMinutes, q.travelFee, q.partsCost, q.partsMargin, q.discount,
          q.values.min, q.values.recommended, q.values.premium, q.finalValue,
          q.warranty.enabled ? 1 : 0, q.warranty.days, q.warranty.coverage,
          q.status, q.validityDate, q.publicToken, q.internalNotes ?? null, q.createdAt
        );
      }
    }

    // Work Orders
    for (const w of mockWorkOrders) {
      const exists = db.prepare("SELECT 1 FROM work_orders WHERE id = ?").get(w.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO work_orders (id, number, customer_id, service_id, quote_id, address, scheduled_at, value, technician, checklist, photos_before, photos_after, parts, technical_notes, payment_method, payment_status, warranty_active, warranty_until, public_token, status, timeline)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          w.id, w.number, w.customerId, w.serviceId, w.quoteId ?? null, w.address, w.scheduledAt,
          w.value, w.technician, JSON.stringify(w.checklist), JSON.stringify(w.photosBefore),
          JSON.stringify(w.photosAfter), JSON.stringify(w.parts), w.technicalNotes ?? null,
          w.paymentMethod ?? null, w.paymentStatus, w.warranty.active ? 1 : 0, w.warranty.until,
          w.publicToken, w.status, JSON.stringify(w.timeline)
        );
      }
    }

    // Payments
    for (const p of mockPayments) {
      const exists = db.prepare("SELECT 1 FROM payments WHERE id = ?").get(p.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO payments (id, work_order_id, customer_id, amount, method, date) VALUES (?, ?, ?, ?, ?, ?)`
        ).run(p.id, p.workOrderId, p.customerId, p.amount, p.method, p.date);
      }
    }

    // Expenses
    for (const e of mockExpenses) {
      const exists = db.prepare("SELECT 1 FROM expenses WHERE id = ?").get(e.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO expenses (id, category, description, amount, date) VALUES (?, ?, ?, ?, ?)`
        ).run(e.id, e.category, e.description, e.amount, e.date);
      }
    }

    // Protocols
    for (const p of mockProtocols) {
      const exists = db.prepare("SELECT 1 FROM protocols WHERE id = ?").get(p.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO protocols (id, title, description, steps) VALUES (?, ?, ?, ?)`
        ).run(p.id, p.title, p.description, JSON.stringify(p.steps));
      }
    }

    // Checklists
    for (const c of mockChecklists) {
      const exists = db.prepare("SELECT 1 FROM checklist_templates WHERE id = ?").get(c.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO checklist_templates (id, title, items) VALUES (?, ?, ?)`
        ).run(c.id, c.title, JSON.stringify(c.items));
      }
    }

    // POPs
    for (const p of mockPOPs) {
      const exists = db.prepare("SELECT 1 FROM pops WHERE id = ?").get(p.id);
      if (!exists) {
        db.prepare(`INSERT INTO pops (id, title, body) VALUES (?, ?, ?)`).run(p.id, p.title, p.body);
      }
    }

    // SLAs
    for (const s of mockSLAs) {
      const exists = db.prepare("SELECT 1 FROM slas WHERE id = ?").get(s.id);
      if (!exists) {
        db.prepare(`INSERT INTO slas (id, label, target, status) VALUES (?, ?, ?, ?)`).run(s.id, s.label, s.target, s.status);
      }
    }

    // Messages
    for (const m of mockMessages) {
      const exists = db.prepare("SELECT 1 FROM message_templates WHERE id = ?").get(m.id);
      if (!exists) {
        db.prepare(`INSERT INTO message_templates (id, label, body) VALUES (?, ?, ?)`).run(m.id, m.label, m.body);
      }
    }

    // Referrals
    for (const r of mockReferrals) {
      const exists = db.prepare("SELECT 1 FROM referrals WHERE id = ?").get(r.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO referrals (id, from_customer_id, name, whatsapp, service_type, note, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(r.id, r.fromCustomerId, r.name, r.whatsapp, r.serviceType, r.note ?? null, r.status, r.createdAt);
      }
    }

    // Followups
    for (const f of mockFollowups) {
      const exists = db.prepare("SELECT 1 FROM followups WHERE id = ?").get(f.id);
      if (!exists) {
        db.prepare(
          `INSERT INTO followups (id, customer_id, work_order_id, kind, due_date, done, message) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(f.id, f.customerId, f.workOrderId, f.kind, f.dueDate, f.done ? 1 : 0, f.message);
      }
    }
  });

  tx();
  console.log("[DB] Seed completo.");
}
