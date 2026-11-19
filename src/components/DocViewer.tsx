import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { fetchDocument } from '../api/client';
import { LEVEL_LABEL, type DocSegment, type DocumentView, type Me } from '../types';
import { Icon } from './Icon';

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
}

// 열람자 이름·사번·시각을 비스듬히 반복해서 깔아요 (화면 캡처 유출 추적용)
function watermark(me: Me) {
  const stamp = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  const text = escapeXml(`${me.name} ${me.employee_id} · ${stamp}`);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='340' height='190'><text x='170' y='95' text-anchor='middle' transform='rotate(-22 170 95)' font-family='sans-serif' font-size='13' fill='rgba(120,132,152,0.18)'>${text}</text></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

function Seg({ s }: { s: DocSegment }) {
  if ('text' in s) return <>{s.text}</>;
  const label = `${LEVEL_LABEL[s.level]} 이상`;
  return (
    <span className="redact" title={`${LEVEL_LABEL[s.level]} 이상만 볼 수 있어요`}>
      <span aria-hidden="true">{label}</span>
      <span className="sr">가린 내용, {label} 열람 가능</span>
    </span>
  );
}

export function DocViewer({ docId, me, onClose }: { docId: string; me: Me; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [doc, setDoc] = useState<DocumentView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mark = useMemo(() => watermark(me), [me]);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    let alive = true;
    fetchDocument(docId)
      .then((d) => alive && setDoc(d))
      .catch((e) => alive && setError(e instanceof Error ? e.message : '알 수 없는 오류'));
    return () => { alive = false; };
  }, [docId]);

  const close = () => ref.current?.close();
  // 바깥 어두운 영역을 누르면 닫혀요
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => { if (e.target === e.currentTarget) close(); };

  const level = doc ? LEVEL_LABEL[doc.level] : null;

  return (
    <dialog ref={ref} className="docview" onClose={onClose} onClick={onBackdrop} aria-labelledby="docview-title">
      <div className="dv-panel" onContextMenu={(e) => e.preventDefault()}>
        <header className="dv-head">
          <span className={`dv-ico lv${doc?.level ?? 1}`}><Icon name="lock" /></span>
          <div className="dv-title">
            <b id="docview-title">{doc?.title ?? '문서 불러오는 중'}</b>
            {doc && <small>{doc.doc_no} · {doc.owner_dept} · {doc.issued_at}</small>}
          </div>
          {doc && <span className={`lv lv${doc.level}`}>{level}</span>}
          <button type="button" className="dv-close" onClick={close} aria-label="닫기"><Icon name="x" /></button>
        </header>

        {doc && (
          doc.view === 'original' ? (
            <div className="dv-banner ok"><Icon name="shield" /><span><b>원본 문서</b> · {me.name} 님 보안등급({LEVEL_LABEL[me.clearance]})으로 전체를 볼 수 있어요.</span></div>
          ) : (
            <div className="dv-banner warn"><Icon name="eyeoff" /><span><b>{doc.redacted_count}곳을 가렸어요</b> · {me.name} 님 보안등급({LEVEL_LABEL[me.clearance]})에 맞춰 가공한 문서예요.</span></div>
          )
        )}

        <div className="dv-body">
          {error ? (
            <p className="dv-state error">문서를 열지 못했어요. {error}</p>
          ) : !doc ? (
            <p className="dv-state">보안등급을 확인하고 문서를 불러오는 중이에요…</p>
          ) : (
            <article className="paper">
              <div className="classif">{level}</div>
              <h1>{doc.title}</h1>
              {doc.sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  {s.blocks.map((b, i) =>
                    b.type === 'p' ? (
                      <p key={i}>{b.segments.map((x, j) => <Seg key={j} s={x} />)}</p>
                    ) : (
                      <table key={i}>
                        <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                        <tbody>
                          {b.rows.map((r, ri) => (
                            <tr key={ri}>{r.map((x, ci) => <td key={ci}><Seg s={x} /></td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    ),
                  )}
                </section>
              ))}
              <div className="classif">{level}</div>
              <div className="wm" style={{ backgroundImage: mark }} aria-hidden="true" />
            </article>
          )}
        </div>

        <footer className="dv-foot">열람 기록이 남아요 · 화면 캡처, 인쇄, 외부 반출을 금지해요</footer>
      </div>
    </dialog>
  );
}
