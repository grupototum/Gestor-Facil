import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import type { Company, PricingSettings, Protocol, ChecklistTemplate, POP, SLA, MessageTemplate } from "@/types";

// Company
export const getCompany = createServerFn({ method: "GET" }).handler(async (): Promise<Company | null> => {
  const row = db.prepare("SELECT * FROM company LIMIT 1").get();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline ?? undefined,
    whatsapp: row.whatsapp,
    phone: row.phone ?? undefined,
    instagram: row.instagram ?? undefined,
    googleProfile: row.google_profile ?? undefined,
    region: row.region,
    hours: row.hours,
    logoUrl: row.logo_url ?? undefined,
    primaryColor: row.primary_color,
  };
});

export const updateCompany = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<Company> => {
    db.prepare(
      `UPDATE company SET name=?, tagline=?, whatsapp=?, phone=?, instagram=?, google_profile=?, region=?, hours=?, logo_url=?, primary_color=? WHERE id=?`
    ).run(
      data.name, data.tagline ?? null, data.whatsapp, data.phone ?? null, data.instagram ?? null,
      data.googleProfile ?? null, data.region, data.hours, data.logoUrl ?? null, data.primaryColor, data.id
    );
    const row = db.prepare("SELECT * FROM company LIMIT 1").get();
    return {
      id: row.id, name: row.name, tagline: row.tagline ?? undefined, whatsapp: row.whatsapp,
      phone: row.phone ?? undefined, instagram: row.instagram ?? undefined,
      googleProfile: row.google_profile ?? undefined, region: row.region, hours: row.hours,
      logoUrl: row.logo_url ?? undefined, primaryColor: row.primary_color,
    };
  });

// Pricing
export const getPricing = createServerFn({ method: "GET" }).handler(async (): Promise<PricingSettings | null> => {
  const row = db.prepare("SELECT * FROM pricing_settings WHERE id = 1").get();
  if (!row) return null;
  return {
    hourRate: row.hour_rate, visitFee: row.visit_fee, defaultMargin: row.default_margin,
    warrantyDays: row.warranty_days, quoteValidityDays: row.quote_validity_days,
    urgencyFast: row.urgency_fast, urgencyEmergency: row.urgency_emergency, urgencyAfterHours: row.urgency_after_hours,
  };
});

export const updatePricing = createServerFn({ method: "POST" })
  .handler(async ({ data }: any): Promise<PricingSettings> => {
    db.prepare(
      `UPDATE pricing_settings SET hour_rate=?, visit_fee=?, default_margin=?, warranty_days=?, quote_validity_days=?, urgency_fast=?, urgency_emergency=?, urgency_after_hours=? WHERE id=1`
    ).run(
      data.hourRate, data.visitFee, data.defaultMargin, data.warrantyDays, data.quoteValidityDays,
      data.urgencyFast, data.urgencyEmergency, data.urgencyAfterHours
    );
    return data;
  });

// Protocols
export const getProtocols = createServerFn({ method: "GET" }).handler(async (): Promise<Protocol[]> => {
  const rows = db.prepare("SELECT * FROM protocols ORDER BY title").all();
  return rows.map((r: any) => ({ id: r.id, title: r.title, description: r.description, steps: JSON.parse(r.steps) }));
});

// Checklists
export const getChecklists = createServerFn({ method: "GET" }).handler(async (): Promise<ChecklistTemplate[]> => {
  const rows = db.prepare("SELECT * FROM checklist_templates ORDER BY title").all();
  return rows.map((r: any) => ({ id: r.id, title: r.title, items: JSON.parse(r.items) }));
});

// POPs
export const getPOPs = createServerFn({ method: "GET" }).handler(async (): Promise<POP[]> => {
  const rows = db.prepare("SELECT * FROM pops ORDER BY title").all();
  return rows.map((r: any) => ({ id: r.id, title: r.title, body: r.body }));
});

// SLAs
export const getSLAs = createServerFn({ method: "GET" }).handler(async (): Promise<SLA[]> => {
  const rows = db.prepare("SELECT * FROM slas ORDER BY label").all();
  return rows.map((r: any) => ({ id: r.id, label: r.label, target: r.target, status: r.status }));
});

// Messages
export const getMessageTemplates = createServerFn({ method: "GET" }).handler(async (): Promise<MessageTemplate[]> => {
  const rows = db.prepare("SELECT * FROM message_templates ORDER BY label").all();
  return rows.map((r: any) => ({ id: r.id, label: r.label, body: r.body }));
});
