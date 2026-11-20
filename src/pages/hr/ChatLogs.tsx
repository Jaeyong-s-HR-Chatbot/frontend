import { useMemo, useState } from 'react';
import { CHAT_LOGS } from '../../api/hrMock';
import { Icon } from '../../components/Icon';
import type { HrProps } from './props';
import { Chips, PageTop, SearchBox } from './ui';

type Show = '전체' | '근거 없음';
const CATS = ['전체', ...Array.from(new Set(CHAT_LOGS.map((l) => l.category)))];

export function ChatLogs({ notify }: HrProps) {
  const [show, setShow] = useState<Show>('전체');
  const [cat, setCat] = useState('전체');
  const [q, setQ] = useState('');
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const rows = useMemo(() => CHAT_LOGS.filter((l) =>
    (show === '전체' || l.refused) && (cat === '전체' || l.category === cat) && (!q.trim() || l.question.includes(q.trim())),
  ), [show, cat, q]);
  const refused = CHAT_LOGS.filter((l) => l.refused).length;

  return (
    <>
      <PageTop title="챗봇 로그" sub="질문한 사람은 부서까지만 보여요 · 사번은 저장하지 않아요" search={<SearchBox value={q} onChange={setQ} placeholder="질문 내용 검색" />} />

      <div className="grid">
        <div className="card span4 kpi"><div className="label">최근 질문 (예시)</div><div className="val">{CHAT_LOGS.length}<small>건</small></div><div className="sub">오늘 57건 · 이번 주 380건</div></div>
        <div className="card span4 kpi"><div className="label">근거 없음 응답</div><div className="val">{refused}<small>건</small></div><div className="sub">규정 보완 검토 대상</div></div>
        <div className="card span4 kpi"><div className="label">규정 보완 요청</div><div className="val">{flagged.size}<small>건</small></div><div className="sub">이 화면에서 표시한 질문</div></div>

        <div className="card span12">
          <div className="toolbar">
            <Chips label="응답" value={show} onChange={setShow} options={[{ value: '전체', label: '전체', count: CHAT_LOGS.length }, { value: '근거 없음', label: '근거 없음', count: refused }]} />
            <label className="select">분야
              <select value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
          </div>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>시각</th><th>부서</th><th>분야</th><th>질문</th><th>응답 근거</th><th /></tr></thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id}>
                    <td className="mono">{l.at}</td>
                    <td>{l.dept}</td>
                    <td>{l.category}</td>
                    <td className="wrap">{l.question}</td>
                    <td className="wrap">{l.refused
                      ? <span className="cite refuse"><Icon name="alert" />근거 조문 없음</span>
                      : l.citations.map((c) => <span key={c} className="cite"><Icon name="doc" />{c}</span>)}</td>
                    <td>{l.refused && (flagged.has(l.id)
                      ? <span className="pill ok">요청함</span>
                      : <button type="button" className="btn sm ghost" onClick={() => { setFlagged((s) => new Set(s).add(l.id)); notify('규정 보완 검토 목록에 넣었어요 (목업).'); }}>보완 요청</button>)}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="empty">조건에 맞는 질문이 없어요.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
