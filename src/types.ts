export type Role = 'employee' | 'hr_admin';

/** GET /me 응답 */
export interface Me {
  employee_id: string;
  name: string;
  dept: string;
  grade: string;
  role: Role;
}

/** 답변에 붙는 근거 조문 */
export interface Citation {
  title: string;
}

/** POST /chat 응답 */
export interface ChatResponse {
  answer: string;
  citations: Citation[];
  /** 근거 조문을 못 찾아서 답을 거절했는지 */
  refused: boolean;
}

export interface ChatMessage {
  id: number;
  from: 'user' | 'bot';
  text: string;
  citations?: Citation[];
  refused?: boolean;
}

// ---------------------------------------------------------------- 인사팀(ERP) 목업용

export type EmpStatus = '재직' | '휴직' | '퇴직' | string;

/** 임직원 관리 화면 한 줄 (DB employees + leave_balance + payroll 일부) */
export interface EmployeeRow {
  id: string;
  name: string;
  gender: string;
  dept: string;
  hq: string;
  site: string;
  job: string;
  position: string;
  grade: number;
  duty: string;
  pattern: string;
  status: EmpStatus;
  hire: string;
  email: string;
  base: number;
  leave: { granted: number | null; used: number | null; remaining: number | null } | null;
  pay: { gross: number; net: number; overtime: number; deductions: number } | null;
}

export interface PayrollByHq {
  hq: string;
  people: number;
  gross: number;
  net: number;
  overtime: number;
}

export interface Regulation {
  id: string;
  name: string;
  tier: string;
  category: string;
  effective: string;
  chunks: number;
  searchable: number;
  file: string;
}

/** DB requests.request_type 과 같은 값 */
export type RequestType = '휴가신청' | '출장신청' | '경조금신청' | '출산축하금신청' | '휴직신청' | '복직신청';
export type ApprovalStatus = '대기' | '승인' | '반려';

export interface Approval {
  id: string;
  empId: string;
  name: string;
  dept: string;
  type: RequestType;
  title: string;
  period: string;
  amount?: number;
  createdAt: string;
  /** 결재할 때 확인할 규정 */
  rule: string;
  /** 규정과 비교해 본 자동 점검 결과 */
  check: { ok: boolean; text: string };
  status: ApprovalStatus;
  decidedAt?: string;
  reason?: string;
}

export interface ChatLog {
  id: number;
  at: string;
  dept: string;
  category: string;
  question: string;
  refused: boolean;
  citations: string[];
}
