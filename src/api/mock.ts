import type { ChatResponse, DocBlock, DocRef, DocSegment, DocumentMeta, DocumentView, Me, Role, SecurityLevel, UploadInput } from '../types';

// 백엔드 없이 화면을 볼 때 쓰는 가짜 데이터

// DB 저장소 data/meta/demo_personas.json 의 데모 계정 (사번 E + 네 자리, 직급 1~5급)
// 역할은 DB generate.py 와 같은 규칙: 인사팀 소속이면 hr_admin, 나머지는 employee
const PEOPLE: Omit<Me, 'role' | 'clearance'>[] = [
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

// 보안등급(clearance)은 DB 데모 계정에 아직 없어서 화면 확인용으로 정한 규칙:
// 인사팀 L4, 1급 L3, 2급 L2, 나머지 L1
function clearanceOf(p: Omit<Me, 'role' | 'clearance'>): SecurityLevel {
  if (p.dept === '인사팀') return 4;
  return p.grade === '1급' ? 3 : p.grade === '2급' ? 2 : 1;
}

export const MOCK_ACCOUNTS: Record<string, Me> = Object.fromEntries(
  PEOPLE.map((p) => [p.employee_id, { ...p, role: p.dept === '인사팀' ? 'hr_admin' : 'employee', clearance: clearanceOf(p) } satisfies Me]),
);

/** DB generate.py 의 TEST_PASSWORD (가상 계정 전용) */
export const MOCK_PASSWORD = 'Test1234!';

/** 로그인 화면의 바로가기 버튼용 */
export const MOCK_USERS: Record<Role, Me> = {
  employee: MOCK_ACCOUNTS.E1584,
  hr_admin: MOCK_ACCOUNTS.E1307,
};

const QA: { keys: string[]; res: ChatResponse; docs?: string[] }[] = [
  {
    keys: ['승진'],
    res: {
      answer: '승진심사 기준은 「2027년 승진심사 운영지침」에 정리돼 있어요. L2 등급 문서라 세부 배점과 일정은 아래 문서 보기로 확인해 주세요.',
      citations: [{ title: '인사규정 제31조' }],
      refused: false,
    },
    docs: ['DOC-2026-118'],
  },
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

/* ── 기밀문서 원본 (실제로는 서버에만 있어요) ── */

// 문자열은 L1, [등급, 문자열]은 그 등급 이상만 볼 수 있는 부분
type RawSeg = string | [SecurityLevel, string];
type RawBlock = { type: 'p'; segs: RawSeg[] } | { type: 'table'; head: string[]; rows: RawSeg[][] };
interface RawDoc extends Omit<DocumentView, 'view' | 'redacted_count' | 'sections'> {
  sections: { heading: string; blocks: RawBlock[] }[];
}

const DOCS: Record<string, RawDoc> = {
  'DOC-2026-118': {
    doc_id: 'DOC-2026-118',
    title: '2027년 승진심사 운영지침',
    level: 2,
    doc_no: '인사팀-2026-118',
    owner_dept: '인사팀',
    issued_at: '2026-11-03',
    sections: [
      {
        heading: '1. 목적',
        blocks: [{ type: 'p', segs: ['이 지침은 2027년 정기 승진심사를 공정하고 투명하게 운영하기 위해 심사 대상, 평가 항목, 절차를 정한다.'] }],
      },
      {
        heading: '2. 심사 대상',
        blocks: [
          { type: 'p', segs: ['2026년 12월 31일 기준으로 현 직급 최저 소요연수를 채운 직원을 대상으로 한다. 다만 징계 처분 후 승진 제한 기간 중인 직원은 제외한다.'] },
          { type: 'p', segs: ['직급별 최저 소요연수는 ', [2, '6급 3년, 5급 4년, 4급 5년'], '으로 한다.'] },
        ],
      },
      {
        heading: '3. 평가 항목 및 배점',
        blocks: [
          {
            type: 'table',
            head: ['항목', '배점', '비고'],
            rows: [
              ['근무성적평정', [2, '50점'], [2, '최근 3년 가중 평균 (5:3:2)']],
              ['경력', [2, '20점'], [2, '현 직급 근속 1년당 4점, 최대 5년']],
              ['교육훈련', [2, '15점'], [2, '필수교육 이수 시 10점 + 자격증 가점']],
              ['가점', [2, '15점'], [2, '포상·현장근무·특수직무']],
            ],
          },
        ],
      },
      {
        heading: '4. 직급별 승진 예정 인원',
        blocks: [
          {
            type: 'table',
            head: ['직급', '예정 인원', '현원 대비'],
            rows: [
              ['4급 → 3급', [3, '6명'], [3, '4.1%']],
              ['5급 → 4급', [3, '18명'], [3, '7.3%']],
              ['6급 → 5급', [3, '31명'], [3, '9.8%']],
            ],
          },
        ],
      },
      {
        heading: '5. 심사위원회',
        blocks: [
          { type: 'p', segs: ['심사위원회는 위원장 1명과 위원 6명으로 구성하며, 외부위원을 2명 이상 포함한다.'] },
          { type: 'p', segs: ['위원장: ', [4, '경영지원본부장 한상철'], ' / 외부위원: ', [4, '노무법인 정도 최윤아 노무사, ○○대학교 경영학과 서진우 교수']] },
        ],
      },
      {
        heading: '6. 일정',
        blocks: [
          { type: 'p', segs: ['심사 공고는 ', [2, '2026년 12월 8일'], ', 심사는 ', [2, '2027년 1월 12일~16일'], ', 결과 발표는 ', [2, '2027년 1월 23일'], '에 한다.'] },
        ],
      },
    ],
  },
};

// 서버가 하는 가공을 흉내 내요: 등급이 모자란 부분은 원문을 빼고 표시만 남겨요
function redactSeg(seg: RawSeg, clearance: SecurityLevel, count: { n: number }): DocSegment {
  if (typeof seg === 'string') return { text: seg };
  const [level, text] = seg;
  if (level <= clearance) return { text };
  count.n += 1;
  return { redacted: true, level };
}

function redactDoc(raw: RawDoc, clearance: SecurityLevel): DocumentView {
  const count = { n: 0 };
  const sections = raw.sections.map((s) => ({
    heading: s.heading,
    blocks: s.blocks.map((b): DocBlock =>
      b.type === 'p'
        ? { type: 'p', segments: b.segs.map((x) => redactSeg(x, clearance, count)) }
        : { type: 'table', head: b.head, rows: b.rows.map((r) => r.map((x) => redactSeg(x, clearance, count))) },
    ),
  }));
  return { ...raw, sections, view: count.n === 0 ? 'original' : 'redacted', redacted_count: count.n };
}

function maxLevel(raw: RawDoc): SecurityLevel {
  let max: SecurityLevel = raw.level;
  for (const s of raw.sections)
    for (const b of s.blocks)
      for (const seg of b.type === 'p' ? b.segs : b.rows.flat())
        if (typeof seg !== 'string' && seg[0] > max) max = seg[0];
  return max;
}

export function mockChat(message: string, me: Me): ChatResponse {
  const hit = QA.find((q) => q.keys.some((k) => message.includes(k)));
  if (!hit) return REFUSE;
  const documents: DocRef[] = (hit.docs ?? []).map((id) => {
    const raw = DOCS[id];
    return { doc_id: id, title: raw.title, level: raw.level, view: me.clearance >= maxLevel(raw) ? 'original' : 'redacted' };
  });
  return { ...hit.res, documents };
}

export function mockDocument(docId: string, me: Me): DocumentView {
  const raw = DOCS[docId];
  if (raw) return redactDoc(raw, me.clearance);
  const meta = DOC_LIST.find((d) => d.doc_id === docId);
  if (!meta) throw new Error('문서를 찾을 수 없어요.');
  // 예시 모드에선 업로드한 파일 본문이 없어서 안내 문구만 보여줘요
  const { title, level, doc_no, owner_dept, issued_at, file_name } = meta;
  return {
    doc_id: docId, title, level, doc_no, owner_dept, issued_at, view: 'original', redacted_count: 0,
    sections: [{ heading: '본문', blocks: [{ type: 'p', segments: [{ text: `예시 모드라 본문이 없어요. 실제로는 서버가 「${file_name}」을 분석해서 문단·표 단위로 보내요.` }] }] }],
  };
}

/* ── 문서 관리 (인사팀) ── */

const DOC_LIST: DocumentMeta[] = [
  { doc_id: 'DOC-2026-118', title: '2027년 승진심사 운영지침', level: 2, doc_no: '인사팀-2026-118', owner_dept: '인사팀', issued_at: '2026-11-03', file_name: '2027_승진심사_운영지침.hwpx', file_size: 184_320, uploaded_at: '2026-11-03T10:12:00', uploaded_by: '김수아', status: 'ready' },
  { doc_id: 'DOC-2026-097', title: '2026년 임금협약 체결안', level: 3, doc_no: '노사협력팀-2026-097', owner_dept: '노사협력팀', issued_at: '2026-09-22', file_name: '2026_임금협약_체결안.pdf', file_size: 1_248_000, uploaded_at: '2026-09-22T15:40:00', uploaded_by: '김수아', status: 'ready' },
  { doc_id: 'DOC-2026-071', title: '징계양정 세부기준', level: 3, doc_no: '감사실-2026-071', owner_dept: '감사실', issued_at: '2026-07-01', file_name: '징계양정_세부기준.docx', file_size: 96_256, uploaded_at: '2026-07-02T09:05:00', uploaded_by: '정민호', status: 'ready' },
  { doc_id: 'DOC-2026-044', title: '교대근무 인력 운영계획(안)', level: 2, doc_no: '운영기획팀-2026-044', owner_dept: '운영기획팀', issued_at: '2026-04-15', file_name: '교대근무_인력운영계획.pdf', file_size: 512_000, uploaded_at: '2026-04-16T11:30:00', uploaded_by: '정민호', status: 'ready' },
  { doc_id: 'DOC-2026-012', title: '임원 보수 산정 기준', level: 4, doc_no: '경영지원팀-2026-012', owner_dept: '경영지원팀', issued_at: '2026-01-10', file_name: '임원_보수_산정기준.pdf', file_size: 302_080, uploaded_at: '2026-01-12T14:20:00', uploaded_by: '김수아', status: 'ready' },
];

export function mockListDocuments(): DocumentMeta[] {
  return DOC_LIST.map((d) => ({ ...d }));
}

export function mockUploadDocument(file: File, input: UploadInput, me: Me): DocumentMeta {
  const doc: DocumentMeta = {
    ...input,
    doc_id: `DOC-2026-${String(200 + DOC_LIST.length).padStart(3, '0')}`,
    doc_no: input.doc_no || `${input.owner_dept}-2026-${200 + DOC_LIST.length}`,
    file_name: file.name,
    file_size: file.size,
    uploaded_at: new Date().toISOString(),
    uploaded_by: me.name,
    status: 'processing',
  };
  DOC_LIST.unshift(doc);
  // 서버가 분석을 끝낸 것처럼 몇 초 뒤 등록 완료로 바꿔요
  setTimeout(() => { doc.status = 'ready'; }, 4000);
  return { ...doc };
}

export function mockDeleteDocument(docId: string) {
  const i = DOC_LIST.findIndex((d) => d.doc_id === docId);
  if (i >= 0) DOC_LIST.splice(i, 1);
}
