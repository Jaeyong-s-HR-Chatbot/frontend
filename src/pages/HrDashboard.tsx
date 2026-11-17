import { useState } from 'react';
import { HEADCOUNT_BY_HQ } from '../api/hrData';
import { Icon } from '../components/Icon';
import type { Approval } from '../types';
import type { HrPage } from './hr/format';
import { PageTop, RejectDialog } from './hr/ui';
import type { HrProps } from './hr/props';

// 목업: 숫자와 목록은 모두 예시 데이터예요 (인원은 DB 데모 데이터 기준)
const CATEGORIES = [
  { label: '근태관리', n: 112 },
  { label: '수당', n: 83 },
  { label: '출장', n: 68 },
  { label: '기타 복리후생', n: 49 },
  { label: '생애이벤트', n: 43 },
  { label: '교육', n: 25 },
];

const ACTIVE = Object.values(HEADCOUNT_BY_HQ).reduce((a, b) => a + b, 0);

export function HrDashboard({ today, approvals, decide, go }: HrProps & { today: string }) {
  const [rejecting, setRejecting] = useState<Approval | null>(null);
  const pending = approvals.filter((a) => a.status === '대기');
  const todayCount = pending.filter((a) => a.createdAt === '2026-11-17').length;
  const flagged = pending.filter((a) => !a.check.ok).length;
  const max = Math.max(...CATEGORIES.map((c) => c.n));
  const hqMax = Math.max(...Object.values(HEADCOUNT_BY_HQ));
  const link = (page: HrPage, text: string) => <button type="button" className="more link" onClick={() => go(page)}>{text}</button>;

  return (
    <>
      <PageTop title="인사팀 대시보드" sub={`${today} · 임직원 ${ACTIVE}명 (퇴직 제외)`} />

      <div className="grid">
        <button type="button" className="card span3 kpi click" onClick={() => go('approvals')}>
          <div className="label">결재 대기</div><div className="val">{pending.length}<small>건</small></div>
          <div className="sub">오늘 들어온 {todayCount}건 · 규정 확인 필요 {flagged}건</div>
        </button>
        <button type="button" className="card span3 kpi click" onClick={() => go('chatlogs')}>
          <div className="label">오늘 챗봇 질문</div><div className="val">57<small>건</small></div><div className="sub">어제보다 12건 많음</div>
        </button>
        <button type="button" className="card span3 kpi click" onClick={() => go('chatlogs')}>
          <div className="label">근거 없음 응답</div><div className="val">6<small>%</small></div><div className="sub">규정에 없는 질문 4건</div>
        </button>
        <button type="button" className="card span3 kpi click" onClick={() => go('attendance')}>
          <div className="label">휴직자</div><div className="val">8<small>명</small></div><div className="sub">육아휴직 복직 예정 1명</div>
        </button>

        <div className="card span8">
          <h2><Icon name="check" />결재 대기{link('approvals', `전체 ${pending.length}건`)}</h2>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>신청자</th><th>종류</th><th>내용</th><th>기간</th><th>점검</th><th /></tr></thead>
              <tbody>
                {pending.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><div className="who"><div className="av">{p.name.slice(0, 1)}</div><div>{p.name}<small>{p.dept}</small></div></div></td>
                    <td>{p.type.replace('신청', '')}</td>
                    <td className="wrap">{p.title}</td>
                    <td>{p.period}</td>
                    <td>{p.check.ok ? <span className="pill ok">규정 일치</span> : <span className="pill warn" title={p.check.text}>확인 필요</span>}</td>
                    <td><div className="act"><button type="button" onClick={() => setRejecting(p)}>반려</button><button type="button" className="p" onClick={() => decide(p.id, '승인')}>승인</button></div></td>
                  </tr>
                ))}
                {pending.length === 0 && <tr><td colSpan={6} className="empty">대기 중인 결재가 없어요.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card span4">
          <h2><Icon name="log" />챗봇 질문 분야 · 이번 주{link('chatlogs', '로그')}</h2>
          <div className="cat">
            {CATEGORIES.map((c) => (
              <div key={c.label}>
                <span>{c.label}</span>
                <span className="track"><i style={{ width: `${Math.round((c.n / max) * 100)}%` }} /></span>
                <span className="n">{c.n}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card span6">
          <h2><Icon name="users" />본부별 인원{link('employees', '임직원 관리')}</h2>
          <div className="cat">
            {Object.entries(HEADCOUNT_BY_HQ).sort((a, b) => b[1] - a[1]).map(([hq, n]) => (
              <div key={hq}>
                <span>{hq}</span>
                <span className="track"><i style={{ width: `${Math.round((n / hqMax) * 100)}%` }} /></span>
                <span className="n">{n}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card span6">
          <h2><Icon name="bell" />이번 달 할 일</h2>
          <div className="list">
            <div className="row"><div className="ico"><Icon name="coin" /></div><div className="t"><b>11월 급여 확정</b><small>지급일 11/25 · 수당 변경 3건 반영 필요</small></div>{link('payroll', '급여')}</div>
            <div className="row"><div className="ico"><Icon name="cal" /></div><div className="t"><b>연차 사용 촉진 2차 통보</b><small>남은 연차 많은 직원에게 사용 시기 지정 요청</small></div>{link('attendance', '근태')}</div>
            <div className="row"><div className="ico"><Icon name="file" /></div><div className="t"><b>여비 세칙 개정 반영</b><small>공무국외출장 규정 10/06 개정 · 챗봇 색인 갱신</small></div>{link('regulations', '규정')}</div>
          </div>
        </div>

        <div className="card span12">
          <div className="notice"><Icon name="alert" /><div><b>규정에 없는 질문</b> · 경조금·결혼 휴가, 주택자금 지원 문의가 이번 주 4건 들어왔어요. 규정 보완이 필요한지 검토해 주세요.</div></div>
        </div>
      </div>

      {rejecting && <RejectDialog item={rejecting} onCancel={() => setRejecting(null)} onConfirm={(r) => { decide(rejecting.id, '반려', r); setRejecting(null); }} />}
    </>
  );
}
