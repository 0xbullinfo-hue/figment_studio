import { query } from '../db.js';

function normalizeInvoiceId(invoiceId) {
  return String(invoiceId || '').trim();
}

function normalizeStatus(status) {
  const normalized = String(status || 'Pending').trim();
  if (['Pending', 'Paid', 'Verifying'].includes(normalized)) {
    return normalized;
  }
  throw new Error('Invalid receipt status');
}

function mapReceipt(row) {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    project: row.project,
    clientName: row.client_name,
    amount: Number(row.amount),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    source: row.source,
  };
}

export async function listReceipts(user = {}) {
  const isAdmin = user.role === 'admin';
  const result = await query(
    isAdmin
      ? `SELECT * FROM invoice_receipts ORDER BY created_at DESC`
      : `SELECT * FROM invoice_receipts WHERE owner_id = $1 OR owner_email = $2 ORDER BY created_at DESC`,
    isAdmin ? [] : [String(user.sub || ''), String(user.email || '').trim().toLowerCase()]
  );
  return result.rows.map(mapReceipt);
}

export async function getReceipt(invoiceId, user = {}) {
  const key = normalizeInvoiceId(invoiceId);
  if (!key) return null;

  const isAdmin = user.role === 'admin';
  const result = await query(
    isAdmin
      ? `SELECT * FROM invoice_receipts WHERE invoice_id = $1`
      : `SELECT * FROM invoice_receipts WHERE invoice_id = $1 AND (owner_id = $2 OR owner_email = $3)`,
    isAdmin ? [key] : [key, String(user.sub || ''), String(user.email || '').trim().toLowerCase()]
  );
  return result.rows[0] ? mapReceipt(result.rows[0]) : null;
}

export async function createReceipt(rawReceipt = {}, user = {}) {
  const invoiceId = normalizeInvoiceId(rawReceipt.invoiceId || rawReceipt.id);
  if (!invoiceId) {
    throw new Error('Receipt invoiceId is required');
  }

  const result = await query(
    `INSERT INTO invoice_receipts
      (invoice_id, owner_id, owner_email, project, client_name, amount, status, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (invoice_id) DO UPDATE SET
       owner_id = COALESCE(invoice_receipts.owner_id, EXCLUDED.owner_id),
       owner_email = COALESCE(invoice_receipts.owner_email, EXCLUDED.owner_email),
       project = EXCLUDED.project,
       client_name = EXCLUDED.client_name,
       amount = EXCLUDED.amount,
       status = EXCLUDED.status,
       source = EXCLUDED.source,
       updated_at = NOW()
     RETURNING *`,
    [
      invoiceId,
      String(user.sub || '').trim() || null,
      String(user.email || '').trim().toLowerCase() || null,
      String(rawReceipt.project || 'Project Estimate'),
      String(rawReceipt.clientName || user.name || 'Client User'),
      Number(rawReceipt.amount || 0),
      normalizeStatus(rawReceipt.status),
      rawReceipt.source === 'payment' ? 'payment' : 'estimate',
    ]
  );
  return mapReceipt(result.rows[0]);
}

export async function updateReceiptStatus(invoiceId, status) {
  const key = normalizeInvoiceId(invoiceId);
  if (!key) return null;
  const result = await query(
    `UPDATE invoice_receipts SET status = $2, updated_at = NOW() WHERE invoice_id = $1 RETURNING *`,
    [key, normalizeStatus(status)]
  );
  return result.rows[0] ? mapReceipt(result.rows[0]) : null;
}
