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
