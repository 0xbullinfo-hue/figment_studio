type UserRole = 'client' | 'admin';
type SubscriptionPlan = 'trial' | 'pro';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: SubscriptionPlan;
}

export interface LoginResponse {
  ok: boolean;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export type GoogleLoginResponse = LoginResponse;

export interface AgentChatPayload {
  message: string;
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  image?: { data: string; mimeType: string };
}

export type ArcVizChatPayload = AgentChatPayload;

export interface AgentChatResponse {
  ok: boolean;
  reply: string;
}

export type ArcVizChatResponse = AgentChatResponse;

export interface ReceiptRecord {
  id: string;
  invoiceId: string;
  project: string;
  clientName: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Verifying';
  createdAt: string;
  source: 'estimate' | 'payment';
}

export interface ReceiptsResponse {
  ok: boolean;
  receipts: ReceiptRecord[];
}

const backendBaseUrl = ((import.meta as any).env.VITE_BACKEND_URL as string | undefined) || 'http://localhost:8787';

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data as T;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return parseJsonResponse<LoginResponse>(response);
}

export async function meRequest(accessToken: string): Promise<{ ok: boolean; user: AuthUser }> {
  const response = await fetch(`${backendBaseUrl}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse<{ ok: boolean; user: AuthUser }>(response);
}

export async function googleLoginRequest(idToken: string): Promise<GoogleLoginResponse> {
  const response = await fetch(`${backendBaseUrl}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  return parseJsonResponse<GoogleLoginResponse>(response);
}

export async function logoutRequest(refreshToken?: string, accessToken?: string): Promise<void> {
  await fetch(`${backendBaseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => undefined);
}

export async function agentChatRequest(accessToken?: string, payload?: AgentChatPayload): Promise<AgentChatResponse> {
  const response = await fetch(`${backendBaseUrl}/api/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload || {}),
  });

  return parseJsonResponse<AgentChatResponse>(response);
}

export const arcvizVisionChatRequest = agentChatRequest;

export async function getPublicStudioContent(): Promise<StudioContentResponse> {
  const response = await fetch(`${backendBaseUrl}/api/content/public`, {
    method: 'GET',
  });

  return parseJsonResponse<StudioContentResponse>(response);
}

export async function getAdminStudioContent(accessToken: string): Promise<StudioContentResponse> {
  const response = await fetch(`${backendBaseUrl}/api/content/admin`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse<StudioContentResponse>(response);
}

export async function deleteAdminResource(path: string, accessToken: string): Promise<StudioContentResponse> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse<StudioContentResponse>(response);
}

export async function putAdminResource(path: string, accessToken: string, body: unknown): Promise<StudioContentResponse> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  return parseJsonResponse<StudioContentResponse>(response);
}

export async function postAdminResource(path: string, accessToken: string, body: unknown): Promise<StudioContentResponse> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  return parseJsonResponse<StudioContentResponse>(response);
}

export async function getReceipts(accessToken: string): Promise<ReceiptsResponse> {
  const response = await fetch(`${backendBaseUrl}/api/receipts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return parseJsonResponse<ReceiptsResponse>(response);
}

export async function createReceiptRequest(accessToken: string, receipt: ReceiptRecord): Promise<{ ok: boolean; receipt: ReceiptRecord }> {
  const response = await fetch(`${backendBaseUrl}/api/receipts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(receipt),
  });

  return parseJsonResponse<{ ok: boolean; receipt: ReceiptRecord }>(response);
}

export async function updateReceiptStatusRequest(
  accessToken: string,
  invoiceId: string,
  status: ReceiptRecord['status']
): Promise<{ ok: boolean; receipt: ReceiptRecord }> {
  const response = await fetch(`${backendBaseUrl}/api/receipts/${encodeURIComponent(invoiceId)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  });

  return parseJsonResponse<{ ok: boolean; receipt: ReceiptRecord }>(response);
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
  source?: string;
  referrer?: string;
}): Promise<{ ok: boolean; message: string }> {
  const response = await fetch(`${backendBaseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return parseJsonResponse<{ ok: boolean; message: string }>(response);
}
