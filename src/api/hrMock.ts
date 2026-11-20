import type { Approval, ChatLog } from '../types';

// 인사팀 화면용 예시 결재·챗봇 로그. 사람과 사연은 DB 데모 계정(demo_personas.json)에 맞췄어요.
// R018845, R018846 은 DB requests.csv 에 실제로 '대기' 상태로 들어 있는 신청이에요.

export const APPROVALS: Approval[] = [
  {
    id: 'R018845', empId: 'E1584', name: '이서준', dept: '신호팀', type: '휴가신청',
    title: '청원휴가 · 본인 결혼', period: '12/14 – 12/18 (5일)', createdAt: '2026-11-05',
    rule: '취업규칙 제26조 (청원휴가)', check: { ok: true, text: '본인 결혼 5일 · 기준 일수와 같아요' }, status: '대기',
  },
  {
    id: 'R018846', empId: 'E1584', name: '이서준', dept: '신호팀', type: '경조금신청',
    title: '축의금 · 본인 결혼', period: '결혼일 12/12', amount: 500000, createdAt: '2026-11-05',
    rule: '복지후생규정 제12조', check: { ok: true, text: '본인 결혼 500,000원 · 지급 기준과 같아요' }, status: '대기',
  },
  {
    id: 'R018847', empId: 'E1465', name: '임태윤', dept: '승무1사업소', type: '휴가신청',
    title: '배우자출산휴가 · 첫째', period: '12/03부터 (20일)', createdAt: '2026-11-12',
    rule: '취업규칙 제57조', check: { ok: true, text: '20일 이내 · 출산 예정일 증빙 첨부됨' }, status: '대기',
  },
  {
    id: 'R018848', empId: 'E1412', name: '박지현', dept: '고객서비스팀', type: '휴직신청',
    title: '육아휴직 · 출산휴가에 이어서', period: '2027-01-17 – 2028-01-16', createdAt: '2026-11-10',
    rule: '인사규정 제44조', check: { ok: true, text: '출산전후휴가 종료 다음 날부터 · 기간 1년' }, status: '대기',
  },
  {
    id: 'R018849', empId: 'E1377', name: '최도윤', dept: '차량1사업소', type: '출산축하금신청',
    title: '출산축하금 · 둘째', period: '출생일 2026-08-14', amount: 3000000, createdAt: '2026-11-13',
    rule: '사내근로복지기금 운영규정 제17조', check: { ok: false, text: '출생 후 3개월이 지났어요 · 신청 기한 확인 필요' }, status: '대기',
  },
  {
    id: 'R018850', empId: 'E1331', name: '서지호', dept: '전력팀', type: '출장신청',
    title: '장기 출장 연장 · 부산 협력사 라인 지원', period: '10/12 – 12/11 (61일)', createdAt: '2026-11-14',
    rule: '여비 및 시험수당 지급세칙 제12조', check: { ok: false, text: '30일 넘는 출장 · 31일째부터 일비 감액 적용' }, status: '대기',
  },
  {
    id: 'R018851', empId: 'E1268', name: '이은지', dept: '차량2사업소', type: '휴가신청',
    title: '병가 · 진단서 없음', period: '11/18 – 11/19 (2일)', createdAt: '2026-11-17',
    rule: '취업규칙 제25조', check: { ok: true, text: '계속 3일 미만 · 진단서 없이 가능' }, status: '대기',
  },
  {
    id: 'R018852', empId: 'E1764', name: '한소율', dept: '역무1센터', type: '휴가신청',
    title: '월차 1일', period: '11/24 (1일)', createdAt: '2026-11-16',
    rule: '취업규칙 제23조', check: { ok: true, text: '1년 미만 월차 · 남은 4일 중 사용' }, status: '대기',
  },
  {
    id: 'R018853', empId: 'E1067', name: '장상호', dept: '차량1사업소', type: '휴가신청',
    title: '연차 2일', period: '11/20 – 11/21 (2일)', createdAt: '2026-11-15',
    rule: '취업규칙 제23조', check: { ok: true, text: '남은 연차 6일 중 사용' }, status: '대기',
  },
  {
    id: 'R018854', empId: 'E1691', name: '송영철', dept: '승무2사업소', type: '출장신청',
    title: '광역시 출장 · 타 사업소 승무 지원', period: '11/25 – 11/26 (1박)', createdAt: '2026-11-17',
    rule: '여비 및 시험수당 지급세칙 별표 2', check: { ok: true, text: '숙박 상한 80,000원 · 일비·식비 50,000원/일' }, status: '대기',
  },
  {
    id: 'R018855', empId: 'E1367', name: '강민재', dept: 'IT팀', type: '복직신청',
    title: '육아휴직 조기 복직', period: '2027-03-02 복직 희망', createdAt: '2026-11-17',
    rule: '인사규정 제47조', check: { ok: true, text: '복직 30일 전 신청 · 원 부서 복귀 가능' }, status: '대기',
  },
  // 처리한 건
  {
    id: 'R018838', empId: 'E1481', name: '황미정', dept: '역무1센터', type: '휴가신청',
    title: '반차 · 오후', period: '11/14 (0.5일)', createdAt: '2026-11-12',
    rule: '취업규칙 제23조', check: { ok: true, text: '남은 연차 3.5일 중 사용' }, status: '승인', decidedAt: '2026-11-12',
  },
  {
    id: 'R018836', empId: 'E1520', name: '김현정', dept: '운전계획팀', type: '출장신청',
    title: '광역시 출장 · 타 사업소 승무 지원', period: '11/12 – 11/14 (2박)', createdAt: '2026-11-06',
    rule: '여비 및 시험수당 지급세칙 별표 2', check: { ok: true, text: '숙박 상한 80,000원' }, status: '승인', decidedAt: '2026-11-07',
  },
  {
    id: 'R018830', empId: 'E1606', name: '박미경', dept: '승무2사업소', type: '경조금신청',
    title: '조위금 · 외조부', period: '사망일 11/02', amount: 300000, createdAt: '2026-11-04',
    rule: '복지후생규정 제12조', check: { ok: false, text: '외조부는 지급 대상이 아니에요' }, status: '반려', decidedAt: '2026-11-05',
    reason: '지급 대상 가족(본인·배우자의 부모, 자녀)이 아님. 청원휴가는 가능해요.',
  },
];

export const CHAT_LOGS: ChatLog[] = [
  { id: 1, at: '11/17 09:12', dept: '신호팀', category: '생애이벤트', question: '결혼하면 경조금 얼마야?', refused: true, citations: [] },
  { id: 2, at: '11/17 09:05', dept: '승무1사업소', category: '생애이벤트', question: '배우자 출산휴가 나눠서 쓸 수 있어?', refused: false, citations: ['취업규칙 제57조'] },
  { id: 3, at: '11/17 08:51', dept: '전력팀', category: '출장', question: '출장 한 달 넘으면 일비 줄어?', refused: false, citations: ['여비 및 시험수당 지급세칙 제12조'] },
  { id: 4, at: '11/17 08:40', dept: '역무1센터', category: '근태관리', question: '입사 1년 안 됐는데 연차 몇 개야?', refused: false, citations: ['취업규칙 제23조'] },
  { id: 5, at: '11/16 22:17', dept: '차량2사업소', category: '근태관리', question: '감기로 이틀 쉬면 진단서 내야 돼?', refused: false, citations: ['취업규칙 제25조'] },
  { id: 6, at: '11/16 18:03', dept: '재무팀', category: '기타 복리후생', question: '주택자금 대출 지원 있어?', refused: true, citations: [] },
  { id: 7, at: '11/16 15:44', dept: '운전계획팀', category: '생애이벤트', question: '임금피크제 적용되면 연봉 얼마나 줄어?', refused: false, citations: ['임금피크제 운영 내규 제4조'] },
  { id: 8, at: '11/16 14:20', dept: '고객서비스팀', category: '생애이벤트', question: '육아휴직 중에 급여 나와?', refused: false, citations: ['보수규정 제28조'] },
  { id: 9, at: '11/16 11:09', dept: '승무2사업소', category: '수당', question: '교번근무 야간수당 계산 방법', refused: false, citations: ['보수규정 시행세칙 제31조', '별표 9'] },
  { id: 10, at: '11/16 10:32', dept: '궤도팀', category: '교육', question: '법정교육 안 들으면 어떻게 돼?', refused: false, citations: ['교육훈련규정 제15조'] },
  { id: 11, at: '11/15 17:55', dept: '신호팀', category: '생애이벤트', question: '결혼 휴가 주말 포함이야?', refused: true, citations: [] },
  { id: 12, at: '11/15 16:12', dept: '차량1사업소', category: '수당', question: '둘째 생기면 가족수당 얼마 더 받아?', refused: false, citations: ['보수규정 시행세칙 제24조', '별표 17'] },
  { id: 13, at: '11/15 13:48', dept: '종합관제팀', category: '수당', question: '사내 동호회 지원금 있어?', refused: true, citations: [] },
  { id: 14, at: '11/15 09:30', dept: '역무3센터', category: '출장', question: '광역시 1박 2일 출장비는?', refused: false, citations: ['여비 및 시험수당 지급세칙 제7조', '별표 2'] },
];
