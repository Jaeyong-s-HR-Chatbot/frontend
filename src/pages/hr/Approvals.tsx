import { useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import type { Approval, RequestType } from '../../types';
import type { HrProps } from './props';
import { won } from './format';
import { Chips, PageTop, RejectDialog, SearchBox, StatusPill } from './ui';

type Tab = '대기' | '처리';
type TypeFilter = '전체' | RequestType;
const TYPES: TypeFilter[] = ['전체', '휴가신청', '출장신청', '경조금신청', '출산축하금신청', '휴직신청', '복직신청'];

export function Approvals({ approvals, decide, go, initialEmpId }: HrProps & { initialEmpId?: string }) {
  const [tab, setTab] = useState<Tab>('대기');
  const [type, setType] = useState<TypeFilter>('전체');
  const [q, setQ] = useState(initialEmpId ?? '');
  const [selId, setSelId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState<Approval | null>(null);

  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return approvals.filter((a) =>
      (tab === '대기' ? a.status === '대기' : a.status !== '대기') &&
      (type === '전체' || a.type === type) &&
      (!k || a.empId.toLowerCase().includes(k) || a.name.includes(k) || a.dept.includes(k) || a.title.includes(k)),
    );
  }, [approvals, tab, type, q]);

  const sel = rows.find((r) => r.id === selId) ?? rows[0] ?? null;
  const pendingCount = approvals.filter((a) => a.status === '대기').length;
  const okChecked = rows.filter((r) => checked.has(r.id) && r.check.ok);

  function toggle(id: string) {
    setChecked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function approveChecked() {
    okChecked.forEach((r) => decide(r.id, '승인'));
    setChecked(new Set());
  }

  return (
    <>
      <PageTop title="결재 관리" sub="신청 내용을 규정과 비교해 자동 점검한 결과가 함께 보여요" search={<SearchBox value={q} onChange={setQ} placeholder="사번, 이름, 부서, 내용 검색" />} />

      <div className="toolbar">
        <Chips label="처리 상태" value={tab} onChange={(t) => { setTab(t); setSelId(null); setChecked(new Set()); }}
          options={[{ value: '대기', label: '결재 대기', count: pendingCount }, { value: '처리', label: '처리 완료', count: approvals.length - pendingCount }]} />
        <label className="select">종류
          <select value={type} onChange={(e) => setType(e.target.value as TypeFilter)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        {tab === '대기' && (
          <button type="button" className="btn right" disabled={okChecked.length === 0} onClick={approveChecked}>
            선택한 {okChecked.length}건 일괄 승인
          </button>
        )}
      </div>

      <div className="grid">
        <div className="card span7 flush">
          <div className="scroll">
            <table className="tbl hover">
              <thead><tr>{tab === '대기' && <th aria-label="선택" />}<th>신청자</th><th>내용</th><th>신청일</th><th>{tab === '대기' ? '점검' : '결과'}</th></tr></thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className={sel?.id === a.id ? 'sel' : ''} onClick={() => setSelId(a.id)}>
                    {tab === '대기' && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={checked.has(a.id)} onChange={() => toggle(a.id)} aria-label={`${a.name} ${a.title} 선택`}
                          disabled={!a.check.ok} title={a.check.ok ? undefined : '확인이 필요한 건은 하나씩 처리해 주세요'} />
                      </td>
                    )}
                    <td><div className="who"><div className="av">{a.name.slice(0, 1)}</div><div>{a.name}<small>{a.dept}</small></div></div></td>
                    <td className="wrap"><b className="fw">{a.title}</b><small className="block">{a.type} · {a.period}</small></td>
                    <td className="mono">{a.createdAt.slice(5).replace('-', '/')}</td>
                    <td>{tab === '대기'
                      ? (a.check.ok ? <span className="pill ok">규정 일치</span> : <span className="pill warn">확인 필요</span>)
                      : <StatusPill status={a.status} />}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={5} className="empty">{tab === '대기' ? '대기 중인 결재가 없어요.' : '처리한 결재가 없어요.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card span5">
          {sel ? (
            <div className="detail">
              <div className="dhead">
                <div><small className="mono">{sel.id} · {sel.type}</small><h3>{sel.title}</h3></div>
                <StatusPill status={sel.status} />
              </div>
              <dl className="kv">
                <dt>신청자</dt><dd><button type="button" className="rowlink" onClick={() => go('employees', { empId: sel.empId })}>{sel.name}</button> · {sel.empId} · {sel.dept}</dd>
                <dt>기간</dt><dd>{sel.period}</dd>
                {sel.amount !== undefined && <><dt>금액</dt><dd className="mono">{won(sel.amount)}원</dd></>}
                <dt>신청일</dt><dd className="mono">{sel.createdAt}</dd>
                {sel.decidedAt && <><dt>처리일</dt><dd className="mono">{sel.decidedAt}</dd></>}
              </dl>

              <div className={`checkbox ${sel.check.ok ? 'ok' : 'warn'}`}>
                <Icon name={sel.check.ok ? 'check' : 'alert'} />
                <div><b>{sel.check.ok ? '규정 기준과 맞아요' : '확인이 필요해요'}</b><small>{sel.check.text}</small></div>
              </div>
              <span className="cite"><Icon name="doc" />{sel.rule}</span>

              {sel.reason && <p className="reason"><b>반려 사유</b> {sel.reason}</p>}

              {sel.status === '대기' && (
                <div className="act end">
                  <button type="button" onClick={() => setRejecting(sel)}>반려</button>
                  <button type="button" className="p" onClick={() => decide(sel.id, '승인')}>승인</button>
                </div>
              )}
            </div>
          ) : <p className="empty">왼쪽에서 신청을 고르면 내용이 보여요.</p>}
        </div>
      </div>

      {rejecting && <RejectDialog item={rejecting} onCancel={() => setRejecting(null)} onConfirm={(r) => { decide(rejecting.id, '반려', r); setRejecting(null); }} />}
    </>
  );
}
