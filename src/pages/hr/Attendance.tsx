import { useState } from 'react';
import { EMPLOYEES } from '../../api/hrData';
import { Icon } from '../../components/Icon';
import type { HrProps } from './props';
import { PageTop } from './ui';

// 목업: 휴직·출장 사연은 DB 데모 계정 시나리오(demo_personas.json)를 따랐어요
const ABSENCES = [
  { empId: 'E1367', name: '강민재', dept: 'IT팀', kind: '육아휴직', period: '2026-07-01 – 2027-06-30', note: '조기 복직 신청 (2027-03-02)' },
  { empId: 'E1412', name: '박지현', dept: '고객서비스팀', kind: '출산전후휴가', period: '2026-10-19 – 2027-01-16', note: '이어서 육아휴직 신청' },
  { empId: 'E1403', name: '김정수', dept: '통신팀', kind: '질병휴직', period: '2026-09-01 – 2026-12-31', note: '복직 전 진단서 필요' },
];

const TRIPS = [
  { name: '서지호', dept: '전력팀', where: '부산 (광역시)', period: '10/12 – 12/11', note: '61일 · 31일째부터 일비 감액' },
  { name: '송영철', dept: '승무2사업소', where: '광역시', period: '11/25 – 11/26', note: '결재 대기' },
];

// 교대·교번 근무 부서의 이번 주 근무표 충원 현황 (예시)
const SHIFTS = [
  { dept: '승무1사업소', need: 48, have: 46 },
  { dept: '승무2사업소', need: 50, have: 50 },
  { dept: '역무1센터', need: 42, have: 39 },
  { dept: '차량1사업소', need: 32, have: 31 },
];

export function Attendance({ go, notify }: HrProps) {
  const promote = EMPLOYEES
    .filter((e) => e.status === '재직' && e.leave?.granted && (e.leave.remaining ?? 0) >= 9)
    .sort((a, b) => (b.leave!.remaining ?? 0) - (a.leave!.remaining ?? 0));
  const [sent, setSent] = useState<Set<string>>(new Set());
  const withLeave = EMPLOYEES.filter((e) => e.leave?.granted);
  const avgUse = Math.round(withLeave.reduce((s, e) => s + (e.leave!.used ?? 0) / e.leave!.granted!, 0) / withLeave.length * 100);

  function sendAll() {
    setSent(new Set(promote.map((e) => e.id)));
    notify(`연차 사용 촉진 통보 ${promote.length}건을 보냈어요 (목업).`);
  }

  return (
    <>
      <PageTop title="근태 · 휴가 현황" sub="2026년 11월 17일 기준 · 근태 마감 11/20" />

      <div className="grid">
        <div className="card span3 kpi"><div className="label">연차 평균 사용률</div><div className="val">{avgUse}<small>%</small></div><div className="bar"><i style={{ width: `${avgUse}%` }} /></div></div>
        <div className="card span3 kpi"><div className="label">이번 주 휴가자</div><div className="val">38<small>명</small></div><div className="sub">교대근무 부서 21명</div></div>
        <div className="card span3 kpi"><div className="label">휴직 · 장기휴가</div><div className="val">{ABSENCES.length}<small>명 (예시)</small></div><div className="sub">전체 휴직자 8명</div></div>
        <div className="card span3 kpi"><div className="label">출장 중</div><div className="val">1<small>명</small></div><div className="sub">30일 넘는 장기 출장 1명</div></div>

        <div className="card span7">
          <h2><Icon name="cal" />연차 사용 촉진 대상 · 남은 연차 9일 이상
            <button type="button" className="btn sm right" onClick={sendAll} disabled={sent.size === promote.length}>{sent.size === promote.length ? '모두 통보함' : '전체 통보'}</button>
          </h2>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>이름</th><th>부서</th><th>부여</th><th>사용</th><th>남음</th><th /></tr></thead>
              <tbody>
                {promote.map((e) => (
                  <tr key={e.id}>
                    <td><button type="button" className="rowlink" onClick={() => go('employees', { empId: e.id })}>{e.name}</button></td>
                    <td>{e.dept}</td>
                    <td className="mono">{e.leave!.granted}</td>
                    <td className="mono">{e.leave!.used}</td>
                    <td className="mono"><b>{e.leave!.remaining}</b></td>
                    <td>{sent.has(e.id) ? <span className="pill ok">통보함</span>
                      : <button type="button" className="btn sm ghost" onClick={() => { setSent((s) => new Set(s).add(e.id)); notify(`${e.name} 님에게 사용 촉진 통보를 보냈어요 (목업).`); }}>통보</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">근로기준법 제61조 · 연차 소멸 6개월 전, 2개월 전 두 번 통보해야 미사용 수당 지급 의무가 없어요.</p>
        </div>

        <div className="card span5">
          <h2><Icon name="users" />교대 · 교번 근무 충원 · 이번 주</h2>
          <div className="cat">
            {SHIFTS.map((s) => {
              const short = s.need - s.have;
              return (
                <div key={s.dept} className="cat-row">
                  <span>{s.dept}</span>
                  <span className="track"><i className={short > 2 ? 'warn' : ''} style={{ width: `${Math.round((s.have / s.need) * 100)}%` }} /></span>
                  <span className="n">{short > 0 ? `−${short}` : '충원'}</span>
                </div>
              );
            })}
          </div>
          <p className="fine">역무1센터는 휴가자가 몰려 3명이 부족해요. 대체근무 지정이 필요해요.</p>
        </div>

        <div className="card span7">
          <h2><Icon name="heart" />휴직 · 장기휴가</h2>
          <div className="list">
            {ABSENCES.map((a) => (
              <div key={a.empId} className="row">
                <div className="ico"><Icon name="heart" /></div>
                <div className="t"><b>{a.name} · {a.kind}</b><small>{a.dept} · {a.period}</small></div>
                <span className="pill neu">{a.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card span5">
          <h2><Icon name="train" />출장</h2>
          <div className="list">
            {TRIPS.map((t) => (
              <div key={t.name} className="row">
                <div className="ico"><Icon name="train" /></div>
                <div className="t"><b>{t.name} · {t.where}</b><small>{t.dept} · {t.period}</small></div>
                <span className="pill warn">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
