export type Role = 'employee' | 'hr_admin';

/** 보안등급 L1~L4. 숫자가 클수록 높아요 (L4가 최고) */
export type SecurityLevel = 1 | 2 | 3 | 4;

export const LEVEL_LABEL: Record<SecurityLevel, string> = { 1: 'L1', 2: 'L2', 3: 'L3', 4: 'L4' };

/** GET /me 응답 */
export interface Me {
  employee_id: string;
  name: string;
  dept: string;
  grade: string;
  role: Role;
  /** 이 사람이 열람할 수 있는 최고 보안등급 */
  clearance: SecurityLevel;
}

/** 답변에 붙는 근거 조문 */
export interface Citation {
  title: string;
}

/**
 * 답변에 붙는 기밀문서 안내.
 * 답변 본문에는 "이런 문서가 있다"까지만 나오고, 내용은 문서 보기(GET /documents/{doc_id})로 열어요.
 */
export interface DocRef {
  doc_id: string;
  title: string;
  /** 보안 문서인지 (켜져 있으면 부분별로 등급에 따라 가려져요) */
  confidential: boolean;
  /** 이 사용자가 보게 될 형태: 등급이 충분하면 원본, 아니면 가공본 */
  view: 'original' | 'redacted';
}

/** POST /chat 응답 */
export interface ChatResponse {
  answer: string;
  citations: Citation[];
  /** 근거 조문을 못 찾아서 답을 거절했는지 */
  refused: boolean;
  /** 관련 기밀문서 (없으면 빈 배열) */
  documents?: DocRef[];
}

export interface ChatMessage {
  id: number;
  from: 'user' | 'bot';
  text: string;
  citations?: Citation[];
  refused?: boolean;
  documents?: DocRef[];
}

/**
 * 문서 조각. 서버가 사용자 등급에 맞춰 가공해서 보내요.
 * 가린 부분은 원문 대신 { redacted, level }만 와요 (원문은 브라우저로 오지 않음).
 */
export type DocSegment = { text: string } | { redacted: true; level: SecurityLevel };

export type DocBlock =
  | { type: 'p'; segments: DocSegment[] }
  | { type: 'table'; head: string[]; rows: DocSegment[][] };

export interface DocSection {
  heading: string;
  blocks: DocBlock[];
}

/** GET /documents/{doc_id} 응답 */
export interface DocumentView {
  doc_id: string;
  title: string;
  confidential: boolean;
  doc_no: string;
  owner_dept: string;
  issued_at: string;
  view: 'original' | 'redacted';
  /** 가린 곳 수 (원본이면 0) */
  redacted_count: number;
  sections: DocSection[];
}

/** 문서 관리 목록 한 줄 (GET /documents) */
export interface DocumentMeta {
  doc_id: string;
  title: string;
  /** 보안 ON/OFF. 문서 전체 등급은 따로 없고, 가릴 부분의 등급은 서버가 정해요 */
  confidential: boolean;
  doc_no: string;
  owner_dept: string;
  issued_at: string;
  file_name: string;
  /** 바이트 */
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
  /** 업로드 후 서버가 파일을 분석(문단 나누기·검색 색인)하는 동안 processing */
  status: 'processing' | 'ready' | 'failed';
}

/** POST /documents (multipart) 에 파일과 함께 보내는 값 */
export interface UploadInput {
  title: string;
  confidential: boolean;
  doc_no: string;
  owner_dept: string;
  issued_at: string;
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
