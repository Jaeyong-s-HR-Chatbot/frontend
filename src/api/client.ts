import type { ChatResponse, Me, Role } from '../types';
import { MOCK_USERS, mockChat } from './mock';

// .env 의 VITE_API_URL 이 비어 있거나 VITE_USE_MOCK=true 면 가짜 데이터로 동작해요.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
export const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === 'true';

const TOKEN_KEY = 'hr_token';
const MOCK_ROLE_KEY = 'hr_mock_role';

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setToken(token: string | null) {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* 저장 못 해도 화면은 동작 */ }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('로그인이 만료됐어요. 다시 로그인해 주세요.');
  }
  if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
  return res.json() as Promise<T>;
}

/** POST /auth/login → { access_token } */
export async function login(username: string, password: string): Promise<void> {
  if (USE_MOCK) throw new Error('지금은 예시 모드라 아래 테스트 계정으로 들어가 주세요.');
  const data = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
}

/** 예시 모드 전용: 역할을 골라서 로그인 */
export function mockLogin(role: Role) {
  try { localStorage.setItem(MOCK_ROLE_KEY, role); } catch { /* 무시 */ }
  setToken(`mock-${role}`);
}

/** GET /me → 로그인한 사람 정보와 역할 */
export async function fetchMe(): Promise<Me | null> {
  if (!getToken()) return null;
  if (USE_MOCK) {
    let role: Role = 'employee';
    try { role = (localStorage.getItem(MOCK_ROLE_KEY) as Role) || 'employee'; } catch { /* 무시 */ }
    return MOCK_USERS[role];
  }
  return request<Me>('/me');
}

export function logout() {
  setToken(null);
}

/** POST /chat → 답변 + 근거 조문 */
export async function sendChat(message: string): Promise<ChatResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    return mockChat(message);
  }
  return request<ChatResponse>('/chat', { method: 'POST', body: JSON.stringify({ message }) });
}
