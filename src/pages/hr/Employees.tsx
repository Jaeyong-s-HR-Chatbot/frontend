import { useEffect, useMemo, useState } from 'react';
import { EMPLOYEES, HEADCOUNT_BY_HQ } from '../../api/hrData';
import { Icon } from '../../components/Icon';
import type { EmployeeRow } from '../../types';
import type { HrProps } from './props';
import { won } from './format';
import { Chips, PageTop, SearchBox, StatusPill } from './ui';

type StatusFilter = '전체' | '재직' | '휴직' | '퇴직';
const HQS = ['전체', ...Object.keys(HEADCOUNT_BY_HQ)];
const TOTAL = 800; // DB employees.csv 전체 인원

export function Employees({ approvals, go, notify, initialEmpId }: HrProps & { initialEmpId?: string }) {
  const [q, setQ] = useState('');
  const [hq, setHq] = useState('전체');
  const [status, setStatus] = useState<StatusFilter>('전체');
  const [selected, setSelected] = useState<EmployeeRow | null>(() => EMPLOYEES.find((e) => e.id === initialEmpId) ?? null);

  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return EMPLOYEES.filter((e) =>
      (hq === '전체' || e.hq === hq) &&
      (status === '전체' || e.status === status) &&
      (!k || e.id.toLowerCase().includes(k) || e.name.includes(k) || e.dept.includes(k)),
    );
  }, [q, hq, status]);

  const count = (s: StatusFilter) => EMPLOYEES.filter((e) => s === '전체' || e.status === s).length;

  return (
    <>
      <PageTop title="임직원 관리" sub={`예시로 ${EMPLOYEES.length}명만 보여요 · 전체 ${TOTAL}명`} search={<SearchBox value={q} onChange={setQ} placeholder="사번, 이름, 부서 검색" />} />

      <div className="card">
        <div className="toolbar">
          <label className="select">본부
            <select value={hq} onChange={(e) => setHq(e.target.value)}>
              {HQS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </label>
          <Chips label="재직 상태" value={status} onChange={setStatus}
            options={(['전체', '재직', '휴직', '퇴직'] as const).map((s) => ({ value: s, label: s, count: count(s) }))} />
          <button type="button" className="btn ghost right" onClick={() => notify('목업이라 내려받기는 동작하지 않아요.')}><Icon name="doc" />엑셀 내려받기</button>
          <button type="button" className="btn" onClick={() => notify('목업: 신규 입사자 등록 화면이 열릴 자리예요.')}>+ 입사자 등록</button>
        </div>

        <div className="scroll">
          <table className="tbl hover">
            <thead><tr><th>사번</th><th>이름</th><th>본부 · 부서</th><th>직위 · 직급</th><th>직무</th><th>근무형태</th><th>입사일</th><th>남은 연차</th><th>상태</th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} onClick={() => setSelected(e)} className={selected?.id === e.id ? 'sel' : ''}>
                  <td className="mono">{e.id}</td>
                  <td><button type="button" className="rowlink" onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}>{e.name}</button>{e.duty !== '팀원' && <span className="tag">{e.duty}</span>}</td>
                  <td>{e.hq} · {e.dept}</td>
                  <td>{e.position} · {e.grade}급</td>
                  <td>{e.job}</td>
                  <td>{e.pattern}</td>
                  <td className="mono">{e.hire}</td>
                  <td className="mono">{e.leave?.remaining ?? '–'}</td>
                  <td><StatusPill status={e.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={9} className="empty">조건에 맞는 임직원이 없어요.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EmployeeDrawer emp={selected} onClose={() => setSelected(null)}
          pending={approvals.filter((a) => a.empId === selected.id && a.status === '대기').length}
          onApprovals={() => go('approvals', { empId: selected.id })} notify={notify} />
      )}
    </>
  );
}

function EmployeeDrawer({ emp, pending, onClose, onApprovals, notify }: {
  emp: EmployeeRow; pending: number; onClose: () => void; onApprovals: () => void; notify: (m: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const years = 2026 - Number(emp.hire.slice(0, 4));
  const usedPct = emp.leave?.granted ? Math.round(((emp.leave.used ?? 0) / emp.leave.granted) * 100) : 0;

  return (
    <aside className="drawer" role="dialog" aria-label={`${emp.name} 인사 정보`}>
      <header>
        <div className="av lg">{emp.name.slice(0, 1)}</div>
        <div className="grow">
          <b>{emp.name} <StatusPill status={emp.status} /></b>
          <small>{emp.id} · {emp.hq} {emp.dept} · {emp.position}({emp.grade}급)</small>
        </div>
        <button type="button" className="x" onClick={onClose} aria-label="닫기">×</button>
      </header>

      <section>
        <h4>인사 기본</h4>
        <dl className="kv">
          <dt>입사일</dt><dd>{emp.hire} · 근속 {years}년</dd>
          <dt>근무지</dt><dd>{emp.site}</dd>
          <dt>직무 · 보직</dt><dd>{emp.job} · {emp.duty}</dd>
          <dt>근무형태</dt><dd>{emp.pattern}</dd>
          <dt>메일</dt><dd>{emp.email}</dd>
          <dt>주민번호 · 계좌</dt><dd className="muted">권한 확인 후 열람 (열람 기록 남음)</dd>
        </dl>
      </section>

      <section>
        <h4>2026 연차</h4>
        {emp.leave?.granted ? (
          <>
            <div className="split"><span>사용 {emp.leave.used}일 / 부여 {emp.leave.granted}일</span><b>남음 {emp.leave.remaining}일</b></div>
            <div className="bar"><i style={{ width: `${usedPct}%` }} /></div>
          </>
        ) : <p className="muted">연차 정보 없음</p>}
      </section>

      <section>
        <h4>2026-10 급여</h4>
        {emp.pay ? (
          <dl className="kv">
            <dt>기본급</dt><dd className="mono">{won(emp.base)}원</dd>
            <dt>지급 합계</dt><dd className="mono">{won(emp.pay.gross)}원</dd>
            <dt>공제 합계</dt><dd className="mono">−{won(emp.pay.deductions)}원</dd>
            <dt>실지급</dt><dd className="mono"><b>{won(emp.pay.net)}원</b></dd>
            <dt>초과근무</dt><dd className="mono">{emp.pay.overtime}시간</dd>
          </dl>
        ) : <p className="muted">{emp.status === '재직' ? '10월 급여 없음' : `${emp.status} 중이라 10월 급여 없음`}</p>}
      </section>

      <footer>
        <button type="button" className="btn ghost" onClick={onApprovals}>결재 {pending ? `대기 ${pending}건` : '내역'}</button>
        <button type="button" className="btn ghost" onClick={() => notify('목업: 인사기록카드 PDF가 열릴 자리예요.')}>인사기록카드</button>
        <button type="button" className="btn" onClick={() => notify('목업: 인사발령 등록 화면이 열릴 자리예요.')}>인사발령</button>
      </footer>
    </aside>
  );
}
