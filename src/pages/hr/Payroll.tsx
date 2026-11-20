import { useState } from 'react';
import { EMPLOYEES, PAYROLL_2026_10 } from '../../api/hrData';
import { Icon } from '../../components/Icon';
import type { HrProps } from './props';
import { eok, won } from './format';
import { PageTop } from './ui';

const STEPS = ['근태 마감', '수당 계산', '변경 반영', '검토', '확정', '지급'];

// 11월 급여에 반영해야 할 수당 변경 (DB 데모 계정 시나리오 기준)
const CHANGES = [
  { empId: 'E1377', name: '최도윤', dept: '차량1사업소', what: '가족수당 · 둘째 자녀 추가', delta: '+ 월 수당 증액', from: '9월분 소급' },
  { empId: 'E1584', name: '이서준', dept: '신호팀', what: '가족수당 · 배우자 추가 예정', delta: '결혼 12/12', from: '12월분부터' },
  { empId: 'E1331', name: '서지호', dept: '전력팀', what: '장기 출장 일비 감액', delta: '31일째부터', from: '11월 정산' },
];

export function Payroll({ go, notify }: HrProps) {
  const [step, setStep] = useState(2); // 0부터. 지금은 '변경 반영' 단계
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const total = PAYROLL_2026_10.reduce((a, r) => ({ people: a.people + r.people, gross: a.gross + r.gross, net: a.net + r.net, overtime: a.overtime + r.overtime }), { people: 0, gross: 0, net: 0, overtime: 0 });
  const ledger = EMPLOYEES.filter((e) => e.pay).slice(0, 12);
  const allApplied = applied.size === CHANGES.length;

  function next() {
    if (step === 2 && !allApplied) { notify('수당 변경을 모두 반영해야 다음 단계로 갈 수 있어요.'); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    notify(`'${STEPS[Math.min(step + 1, STEPS.length - 1)]}' 단계로 넘겼어요 (목업).`);
  }

  return (
    <>
      <PageTop title="급여 · 수당" sub="11월 급여 지급일 11/25 · 지난달(2026-10) 지급 결과는 DB 데모 데이터 기준" />

      <div className="card">
        <h2><Icon name="coin" />11월 급여 진행
          <button type="button" className="btn sm right" onClick={next} disabled={step === STEPS.length - 1}>{step === STEPS.length - 1 ? '지급 완료' : `${STEPS[step + 1]}(으)로 넘기기`}</button>
        </h2>
        <ol className="steps">
          {STEPS.map((s, i) => <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}><span>{i + 1}</span>{s}</li>)}
        </ol>
      </div>

      <div className="grid gap-top">
        <div className="card span3 kpi"><div className="label">10월 지급 인원</div><div className="val">{total.people}<small>명</small></div><div className="sub">휴직자 제외</div></div>
        <div className="card span3 kpi"><div className="label">10월 지급 총액</div><div className="val">{eok(total.gross)}<small>원</small></div><div className="sub">1인 평균 {won(Math.round(total.gross / total.people / 1000))}천원</div></div>
        <div className="card span3 kpi"><div className="label">10월 실지급액</div><div className="val">{eok(total.net)}<small>원</small></div><div className="sub">공제 {eok(total.gross - total.net)}원</div></div>
        <div className="card span3 kpi"><div className="label">10월 초과근무</div><div className="val">{won(Math.round(total.overtime))}<small>시간</small></div><div className="sub">1인 평균 {(total.overtime / total.people).toFixed(1)}시간</div></div>

        <div className="card span5">
          <h2><Icon name="alert" />이번 달 수당 변경 · {CHANGES.length - applied.size}건 남음</h2>
          <div className="list">
            {CHANGES.map((c) => (
              <div key={c.empId} className="row">
                <div className="t"><b>{c.name} · {c.what}</b><small>{c.dept} · {c.delta} · {c.from}</small></div>
                {applied.has(c.empId) ? <span className="pill ok">반영함</span>
                  : <button type="button" className="btn sm ghost" onClick={() => setApplied((s) => new Set(s).add(c.empId))}>반영</button>}
              </div>
            ))}
          </div>
        </div>

        <div className="card span7">
          <h2><Icon name="users" />본부별 10월 급여</h2>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>본부</th><th className="r">인원</th><th className="r">지급 합계</th><th className="r">실지급</th><th className="r">초과근무</th></tr></thead>
              <tbody>
                {[...PAYROLL_2026_10].sort((a, b) => b.gross - a.gross).map((r) => (
                  <tr key={r.hq}><td>{r.hq}</td><td className="mono r">{r.people}</td><td className="mono r">{eok(r.gross)}</td><td className="mono r">{eok(r.net)}</td><td className="mono r">{won(Math.round(r.overtime))}h</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card span12">
          <h2><Icon name="file" />급여 대장 · 2026-10 (일부)<button type="button" className="more link" onClick={() => notify('목업이라 내려받기는 동작하지 않아요.')}>엑셀 내려받기</button></h2>
          <div className="scroll">
            <table className="tbl hover">
              <thead><tr><th>사번</th><th>이름</th><th>부서</th><th>직급</th><th>근무형태</th><th className="r">기본급</th><th className="r">지급 합계</th><th className="r">공제</th><th className="r">실지급</th><th className="r">초과근무</th></tr></thead>
              <tbody>
                {ledger.map((e) => (
                  <tr key={e.id} onClick={() => go('employees', { empId: e.id })}>
                    <td className="mono">{e.id}</td><td>{e.name}</td><td>{e.dept}</td><td>{e.grade}급</td><td>{e.pattern}</td>
                    <td className="mono r">{won(e.base)}</td><td className="mono r">{won(e.pay!.gross)}</td><td className="mono r">{won(e.pay!.deductions)}</td>
                    <td className="mono r"><b>{won(e.pay!.net)}</b></td><td className="mono r">{e.pay!.overtime}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
