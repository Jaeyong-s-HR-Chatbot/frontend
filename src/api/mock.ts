import type { ChatResponse, Me, Role } from '../types';

// 백엔드 없이 화면을 볼 때 쓰는 가짜 데이터

// DB 저장소 data/meta/demo_personas.json 의 데모 계정 (사번 E + 네 자리, 직급 1~5급)
// 역할은 DB generate.py 와 같은 규칙: 인사팀 소속이면 hr_admin, 나머지는 employee
const PEOPLE: Omit<Me, 'role'>[] = [
  { employee_id: 'E1584', name: '이서준', dept: '신호팀', grade: '4급' }, // P1
  { employee_id: 'E1412', name: '박지현', dept: '고객서비스팀', grade: '3급' }, // P2
  { employee_id: 'E1377', name: '최도윤', dept: '차량1사업소', grade: '3급' }, // P3
  { employee_id: 'E1265', name: '정하은', dept: '재무팀', grade: '2급' }, // P4
  { employee_id: 'E1367', name: '강민재', dept: 'IT팀', grade: '3급' }, // P5
  { employee_id: 'E1016', name: '윤영호', dept: '운전계획팀', grade: '1급' }, // P6
  { employee_id: 'E1764', name: '한소율', dept: '역무1센터', grade: '5급' }, // P7
  { employee_id: 'E1307', name: '김수아', dept: '인사팀', grade: '2급' }, // P8
  { employee_id: 'E1465', name: '임태윤', dept: '승무1사업소', grade: '4급' }, // P9
  { employee_id: 'E1331', name: '서지호', dept: '전력팀', grade: '3급' }, // P10
  { employee_id: 'E1003', name: '송정식', dept: '인사팀', grade: '1급' }, // 인사팀장
];

export const MOCK_ACCOUNTS: Record<string, Me> = Object.fromEntries(
  PEOPLE.map((p) => [p.employee_id, { ...p, role: p.dept === '인사팀' ? 'hr_admin' : 'employee' } satisfies Me]),
);

/** DB generate.py 의 TEST_PASSWORD (가상 계정 전용) */
export const MOCK_PASSWORD = 'Test1234!';

/** 로그인 화면의 바로가기 버튼용 */
export const MOCK_USERS: Record<Role, Me> = {
  employee: MOCK_ACCOUNTS.E1584,
  hr_admin: MOCK_ACCOUNTS.E1307,
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
