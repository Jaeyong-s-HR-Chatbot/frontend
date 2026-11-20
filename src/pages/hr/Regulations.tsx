import { useMemo, useState } from 'react';
import { REGULATIONS } from '../../api/hrData';
import { Icon } from '../../components/Icon';
import type { HrProps } from './props';
import { Chips, PageTop, SearchBox } from './ui';

type Tier = '전체' | '핵심' | '보조';
const CATS = ['전체', ...Array.from(new Set(REGULATIONS.map((r) => r.category)))];

/** 검색되는 조각 비율이 이보다 낮으면 경고 */
const LOW = 0.6;

export function Regulations({ go, notify }: HrProps) {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState<Tier>('전체');
  const [cat, setCat] = useState('전체');
  const [indexing, setIndexing] = useState<string | null>(null);

  const rows = useMemo(() => REGULATIONS.filter((r) =>
    (tier === '전체' || r.tier === tier) && (cat === '전체' || r.category === cat) && (!q.trim() || r.name.includes(q.trim())),
  ).sort((a, b) => b.effective.localeCompare(a.effective)), [q, tier, cat]);

  const chunks = REGULATIONS.reduce((s, r) => s + r.chunks, 0);
  const searchable = REGULATIONS.reduce((s, r) => s + r.searchable, 0);
  const low = REGULATIONS.filter((r) => r.searchable / r.chunks < LOW);

  function reindex(id: string, name: string) {
    setIndexing(id);
    setTimeout(() => { setIndexing(null); notify(`${name} 색인을 다시 만들었어요 (목업).`); }, 900);
  }

  return (
    <>
      <PageTop title="규정 관리" sub="챗봇이 답할 때 찾아보는 사내규정 목록이에요 · DB data/regs 기준" search={<SearchBox value={q} onChange={setQ} placeholder="규정 이름 검색" />} />

      <div className="grid">
        <div className="card span3 kpi"><div className="label">등록 규정</div><div className="val">{REGULATIONS.length}<small>개</small></div><div className="sub">핵심 {REGULATIONS.filter((r) => r.tier === '핵심').length} · 보조 {REGULATIONS.filter((r) => r.tier === '보조').length}</div></div>
        <div className="card span3 kpi"><div className="label">검색되는 조문 조각</div><div className="val">{Math.round((searchable / chunks) * 100)}<small>%</small></div><div className="sub">{searchable.toLocaleString()} / {chunks.toLocaleString()}개</div></div>
        <div className="card span3 kpi"><div className="label">색인 점검 필요</div><div className="val">{low.length}<small>개</small></div><div className="sub">검색되는 조각 {LOW * 100}% 미만</div></div>
        <button type="button" className="card span3 kpi click" onClick={() => go('chatlogs')}><div className="label">규정에 없는 질문</div><div className="val">4<small>건</small></div><div className="sub">이번 주 · 챗봇 로그에서 보기</div></button>

        <div className="card span12">
          <div className="toolbar">
            <Chips label="구분" value={tier} onChange={setTier} options={(['전체', '핵심', '보조'] as const).map((t) => ({ value: t, label: t }))} />
            <label className="select">분야
              <select value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <button type="button" className="btn right" onClick={() => notify('목업: 규정 파일(PDF, HWP) 올리기 화면이 열릴 자리예요.')}>+ 개정 규정 올리기</button>
          </div>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>규정</th><th>구분</th><th>분야</th><th>시행일</th><th>검색 가능 조각</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const pct = Math.round((r.searchable / r.chunks) * 100);
                  return (
                    <tr key={r.id}>
                      <td className="wrap"><b className="fw">{r.name}</b><small className="block mono">{r.file.toUpperCase()}</small></td>
                      <td><span className={`pill ${r.tier === '핵심' ? 'ok' : 'neu'}`}>{r.tier}</span></td>
                      <td>{r.category}</td>
                      <td className="mono">{r.effective}</td>
                      <td>
                        <div className="meter"><span className="track"><i className={pct < LOW * 100 ? 'warn' : ''} style={{ width: `${pct}%` }} /></span><span className="mono">{r.searchable}/{r.chunks}</span></div>
                      </td>
                      <td><button type="button" className="btn sm ghost" disabled={indexing === r.id} onClick={() => reindex(r.id, r.name)}>{indexing === r.id ? '색인 중…' : '다시 색인'}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {low.length > 0 && (
            <div className="notice gap-top"><Icon name="alert" /><div><b>색인 점검 필요</b> · {low.map((r) => r.name).join(', ')}는 표·별지가 많아 검색되는 조각이 적어요. 원문을 확인해 주세요.</div></div>
          )}
        </div>
      </div>
    </>
  );
}
