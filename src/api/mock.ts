import type { ChatResponse, Me, Role } from '../types';

// 백엔드 없이 화면을 볼 때 쓰는 가짜 데이터

export const MOCK_USERS: Record<Role, Me> = {
  employee: { employee_id: 'E2023041', name: '김누리', dept: '경영지원팀', grade: '6급', role: 'employee' },
  hr_admin: { employee_id: 'H2019007', name: '정인사', dept: '인사팀', grade: '관리자', role: 'hr_admin' },
};

const QA: { keys: string[]; res: ChatResponse }[] = [
  {
    keys: ['출장비', '1박', '광역시'],
    res: {
      answer: '일비·식비가 하루 5만원(각 2.5만원)이라 2일이면 10만원이고, 숙박비는 실비로 상한 8만원까지 받아요. 합치면 최대 18만원이에요.',
      citations: [{ title: '여비 및 시험수당 지급세칙 제7조, 별표 2' }],
      refused: false,
    },
  },
  {
    keys: ['연차'],
    res: {
      answer: '근속 1년 이상 3년 미만이고 작년에 80% 이상 출근했으니 올해 연차는 15일이에요. 근속 3년이 되면 16일로 늘어나요.',
      citations: [{ title: '취업규칙 제23조, 별표 2' }],
      refused: false,
    },
  },
  {
    keys: ['가족수당', '부모'],
    res: {
      answer: '아버지 60세 이상, 어머니 55세 이상이고 두 분 다 건강보험 피부양자면 받을 수 있어요. 1명당 월 2만원이라 월 4만원이에요.',
      citations: [{ title: '보수규정 시행세칙 제24조, 별표 17' }],
      refused: false,
    },
  },
  {
    keys: ['진단서', '병가', '감기'],
    res: {
      answer: '계속 3일 미만이면 진단서 없이 쓸 수 있어요. 다만 증빙 없이 쓴 병가가 연 7일 이상이면 진단서·소견서·처방전 중 하나를 내야 해요.',
      citations: [{ title: '취업규칙 제25조' }],
      refused: false,
    },
  },
  {
    keys: ['돌봄', '병원'],
    res: {
      answer: '가족돌봄휴가를 연 10일 쓸 수 있어요. 부모 돌봄은 원칙적으로 무급이라, 급여를 받으며 쉬려면 연차를 쓰면 돼요.',
      citations: [{ title: '취업규칙 제58조' }],
      refused: false,
    },
  },
];

const REFUSE: ChatResponse = {
  answer: '이 질문은 등록된 규정에서 근거를 찾지 못했어요. 정확한 내용은 인사팀에 확인해 주세요.',
  citations: [],
  refused: true,
};

export function mockChat(message: string): ChatResponse {
  const hit = QA.find((q) => q.keys.some((k) => message.includes(k)));
  return hit ? hit.res : REFUSE;
}
