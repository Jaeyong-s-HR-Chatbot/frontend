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
  /** 문서 전체의 보안등급 */
  level: SecurityLevel;
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
  level: SecurityLevel;
  doc_no: string;
  owner_dept: string;
  issued_at: string;
  view: 'original' | 'redacted';
  /** 가린 곳 수 (원본이면 0) */
  redacted_count: number;
  sections: DocSection[];
}
