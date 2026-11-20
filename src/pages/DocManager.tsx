import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteDocument, listDocuments } from '../api/client';
import { DocViewer } from '../components/DocViewer';
import { Icon } from '../components/Icon';
import { UploadDialog } from '../components/UploadDialog';
import { formatSize } from '../format';
import { LEVEL_LABEL, type DocumentMeta, type Me, type SecurityLevel } from '../types';

const STATUS: Record<DocumentMeta['status'], { label: string; cls: string }> = {
  processing: { label: '분석 중', cls: 'warn' },
  ready: { label: '등록됨', cls: 'ok' },
  failed: { label: '분석 실패', cls: 'bad' },
};

const fmtDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

export function DocManager({ me, notify }: { me: Me; notify: (msg: string) => void }) {
  const [docs, setDocs] = useState<DocumentMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SecurityLevel | 0>(0);
  const [query, setQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setDocs(await listDocuments());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 분석 중인 문서가 있으면 2초마다 다시 불러와요
  useEffect(() => {
    if (!docs?.some((d) => d.status === 'processing')) return;
    const t = setTimeout(load, 2000);
    return () => clearTimeout(t);
  }, [docs, load]);

  const shown = useMemo(() => {
    const q = query.trim();
    return (docs ?? []).filter((d) => (!filter || d.level === filter) && (!q || d.title.includes(q) || d.doc_no.includes(q) || d.owner_dept.includes(q)));
  }, [docs, filter, query]);

  async function remove(d: DocumentMeta) {
    if (!window.confirm(`「${d.title}」을 삭제할까요?\n챗봇 안내와 문서 보기에서 바로 빠져요.`)) return;
    try {
      await deleteDocument(d.doc_id);
      notify(`「${d.title}」을 삭제했어요.`);
      load();
    } catch (e) {
      notify(`삭제하지 못했어요. ${e instanceof Error ? e.message : ''}`);
    }
  }

  const count = (pred: (d: DocumentMeta) => boolean) => (docs ?? []).filter(pred).length;

  return (
    <>
      <div className="top">
        <div>
          <h1>문서 관리</h1>
          <p>챗봇이 안내하는 기밀문서를 등록하고 보안등급을 정해요</p>
        </div>
        <button type="button" className="top-btn" onClick={() => setUploadOpen(true)}><Icon name="upload" />문서 업로드</button>
      </div>

      <div className="grid">
        <div className="card span4 kpi"><div className="label">등록 문서</div><div className="val">{count((d) => d.status === 'ready')}<small>건</small></div><div className="sub">전체 {docs?.length ?? 0}건</div></div>
        <div className="card span4 kpi"><div className="label">L3 이상</div><div className="val">{count((d) => d.level >= 3)}<small>건</small></div><div className="sub">대부분 직원에게 가려져 보여요</div></div>
        <div className="card span4 kpi"><div className="label">분석 중</div><div className="val">{count((d) => d.status === 'processing')}<small>건</small></div><div className="sub">끝나면 챗봇이 안내하기 시작해요</div></div>

        <div className="card span12">
          <div className="dm-tools">
            <div className="chips" role="group" aria-label="보안등급 필터">
              {([0, 1, 2, 3, 4] as const).map((l) => (
                <button key={l} type="button" className={filter === l ? 'on' : ''} aria-pressed={filter === l} onClick={() => setFilter(l)}>
                  {l === 0 ? '전체' : LEVEL_LABEL[l]}
                </button>
              ))}
            </div>
            <label className="search dm-search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="문서명, 문서번호, 부서" aria-label="문서 검색" /></label>
          </div>

          {error ? (
            <p className="error">목록을 불러오지 못했어요. {error}</p>
          ) : !docs ? (
            <p className="dm-empty">불러오는 중이에요…</p>
          ) : shown.length === 0 ? (
            <p className="dm-empty">{docs.length === 0 ? '아직 등록한 문서가 없어요. 오른쪽 위 문서 업로드로 시작하세요.' : '조건에 맞는 문서가 없어요.'}</p>
          ) : (
            <div className="scroll">
              <table className="tbl dm-tbl">
                <thead><tr><th>문서</th><th>등급</th><th>담당부서</th><th>시행일</th><th>등록</th><th>상태</th><th /></tr></thead>
                <tbody>
                  {shown.map((d) => (
                    <tr key={d.doc_id}>
                      <td>
                        <div className="dm-doc">
                          <span className={`dv-ico lv${d.level}`}><Icon name="lock" /></span>
                          <div className="t"><b>{d.title}</b><small>{d.doc_no} · {d.file_name} · {formatSize(d.file_size)}</small></div>
                        </div>
                      </td>
                      <td><span className={`lv lv${d.level}`}>{LEVEL_LABEL[d.level]}</span></td>
                      <td>{d.owner_dept}</td>
                      <td className="num">{fmtDate(d.issued_at)}</td>
                      <td><span className="num">{fmtDate(d.uploaded_at)}</span><small className="by">{d.uploaded_by}</small></td>
                      <td><span className={`pill ${STATUS[d.status].cls}`}>{STATUS[d.status].label}</span></td>
                      <td>
                        <div className="act">
                          <button type="button" onClick={() => setPreview(d.doc_id)} disabled={d.status !== 'ready'}>미리보기</button>
                          <button type="button" className="danger" onClick={() => remove(d)} aria-label={`${d.title} 삭제`}>삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {uploadOpen && (
        <UploadDialog
          onClose={() => setUploadOpen(false)}
          onUploaded={(doc) => { notify(`「${doc.title}」을 올렸어요. 분석이 끝나면 등록돼요.`); load(); }}
        />
      )}
      {preview && <DocViewer docId={preview} me={me} onClose={() => setPreview(null)} />}
    </>
  );
}
