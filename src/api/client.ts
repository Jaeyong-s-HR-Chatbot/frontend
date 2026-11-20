import type { ChatResponse, DocumentMeta, DocumentView, Me, Role, UploadInput } from '../types';
import { MOCK_ACCOUNTS, MOCK_PASSWORD, MOCK_USERS, mockChat, mockDeleteDocument, mockDocument, mockListDocuments, mockUploadDocument } from './mock';

// .env 의 VITE_API_URL 이 비어 있거나 VITE_USE_MOCK=true 면 가짜 데이터로 동작해요.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
export const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === 'true';

const TOKEN_KEY = 'hr_token';
const MOCK_EMP_KEY = 'hr_mock_emp';

function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setToken(token: string | null) {
  try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); } catch { /* 저장 못 해도 화면은 동작 */ }
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
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** POST /auth/login → { access_token } */
export async function login(username: string, password: string): Promise<void> {
  if (USE_MOCK) return mockLoginById(username, password);
  const data = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
}

// 예시 모드에서 로그인한 사람. 저장소를 못 써도 새로고침 전까지는 유지돼요.
let mockEmpId: string | null = null;

function setMockEmp(empId: string) {
  mockEmpId = empId;
  try { localStorage.setItem(MOCK_EMP_KEY, empId); } catch { /* 무시 */ }
  setToken(`mock-${empId}`);
}

/** 예시 모드: 사번 + 테스트 비밀번호로 로그인. 역할은 사번의 소속(인사팀 여부)으로 정해져요. */
async function mockLoginById(username: string, password: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const empId = username.trim().toUpperCase();
  if (!MOCK_ACCOUNTS[empId] || password !== MOCK_PASSWORD) throw new Error('사번 또는 비밀번호가 맞지 않아요.');
  setMockEmp(empId);
}

/** 예시 모드 전용: 역할을 골라서 바로 로그인 */
export function mockLogin(role: Role) {
  setMockEmp(MOCK_USERS[role].employee_id);
}

/** GET /me → 로그인한 사람 정보와 역할 */
export async function fetchMe(): Promise<Me | null> {
  if (!getToken()) return null;
  if (USE_MOCK) return mockMe();
  return request<Me>('/me');
}

/** 예시 모드: 지금 로그인한 사번의 계정 */
function mockMe(): Me | null {
  let empId = mockEmpId;
  try { empId = localStorage.getItem(MOCK_EMP_KEY) ?? empId; } catch { /* 무시 */ }
  return (empId && MOCK_ACCOUNTS[empId]) || null;
}

/** 예시 모드에서 로그인이 풀린 채로 부르면 임직원 계정으로 처리해요 */
const mockMeOrDefault = () => mockMe() ?? MOCK_USERS.employee;

export function logout() {
  setToken(null);
}

/** POST /chat → 답변 + 근거 조문 */
export async function sendChat(message: string): Promise<ChatResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    return mockChat(message, mockMeOrDefault());
  }
  return request<ChatResponse>('/chat', { method: 'POST', body: JSON.stringify({ message }) });
}

/**
 * GET /documents/{doc_id} → 사용자 보안등급에 맞게 가공된 문서
 * 등급 확인과 가공은 서버에서 해요. 원본을 볼 수 있는 등급이면 원본이 와요.
 */
export async function fetchDocument(docId: string): Promise<DocumentView> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return mockDocument(docId, mockMeOrDefault());
  }
  return request<DocumentView>(`/documents/${encodeURIComponent(docId)}`);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET /documents → 기밀문서 목록 (인사팀) */
export async function listDocuments(): Promise<DocumentMeta[]> {
  if (USE_MOCK) {
    await wait(250);
    return mockListDocuments();
  }
  return request<DocumentMeta[]>('/documents');
}

/**
 * POST /documents (multipart/form-data: file + UploadInput 각 항목) → 등록된 문서
 * 진행률을 보여주려고 fetch 대신 XHR 을 써요.
 */
export async function uploadDocument(file: File, input: UploadInput, onProgress?: (pct: number) => void): Promise<DocumentMeta> {
  if (USE_MOCK) {
    for (let p = 0; p <= 100; p += 10) { onProgress?.(p); await wait(90); }
    return mockUploadDocument(file, input, mockMeOrDefault());
  }
  const form = new FormData();
  form.append('file', file);
  for (const [k, v] of Object.entries(input)) form.append(k, String(v));
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/documents`);
    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      if (xhr.status === 401) { setToken(null); reject(new Error('로그인이 만료됐어요. 다시 로그인해 주세요.')); }
      else if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText) as DocumentMeta);
      else reject(new Error(`서버 응답 오류 (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('네트워크 오류로 올리지 못했어요.'));
    xhr.send(form);
  });
}

/** DELETE /documents/{doc_id} */
export async function deleteDocument(docId: string): Promise<void> {
  if (USE_MOCK) {
    await wait(200);
    return mockDeleteDocument(docId);
  }
  await request<void>(`/documents/${encodeURIComponent(docId)}`, { method: 'DELETE' });
}
