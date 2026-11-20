import { useEffect, useRef, useState, type DragEvent, type FormEvent, type MouseEvent } from 'react';
import { uploadDocument } from '../api/client';
import { formatSize } from '../format';
import type { DocumentMeta } from '../types';
import { Icon } from './Icon';

const ACCEPT = ['.pdf', '.docx', '.hwp', '.hwpx', '.txt'];
const MAX_MB = 50;

const todayIso = () => new Date().toISOString().slice(0, 10);

export function UploadDialog({ onClose, onUploaded }: { onClose: () => void; onUploaded: (doc: DocumentMeta) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [title, setTitle] = useState('');
  const [confidential, setConfidential] = useState(true);
  const [docNo, setDocNo] = useState('');
  const [dept, setDept] = useState('인사팀');
  const [issuedAt, setIssuedAt] = useState(todayIso);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploading = progress !== null;

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const close = () => { if (!uploading) ref.current?.close(); };
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => { if (e.target === e.currentTarget) close(); };

  function pick(f: File | undefined) {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPT.includes(ext)) { setError(`${ACCEPT.join(', ')} 파일만 올릴 수 있어요.`); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`${MAX_MB}MB 이하 파일만 올릴 수 있어요.`); return; }
    setError(null);
    setFile(f);
    // 문서명이 비어 있으면 파일 이름으로 채워요
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '));
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    if (!uploading) pick(e.dataTransfer.files[0]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) { setError('올릴 파일을 골라 주세요.'); return; }
    if (!title.trim()) { setError('문서명을 입력해 주세요.'); return; }
    setError(null);
    setProgress(0);
    try {
      const doc = await uploadDocument(file, { title: title.trim(), confidential, doc_no: docNo.trim(), owner_dept: dept.trim(), issued_at: issuedAt }, setProgress);
      onUploaded(doc);
      ref.current?.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setProgress(null);
    }
  }

  return (
    // 올리는 중에는 Esc 로 닫히지 않게 막아요
    <dialog ref={ref} className="docview upload" onClose={onClose} onCancel={(e) => uploading && e.preventDefault()} onClick={onBackdrop} aria-labelledby="upload-title">
      <form className="dv-panel" onSubmit={onSubmit} noValidate>
        <header className="dv-head">
          <span className="dv-ico"><Icon name="upload" /></span>
          <div className="dv-title"><b id="upload-title">문서 업로드</b></div>
          <button type="button" className="dv-close" onClick={close} aria-label="닫기" disabled={uploading}><Icon name="x" /></button>
        </header>

        <div className="up-body">
          <div
            className={`drop ${drag ? 'on' : ''} ${file ? 'has' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
          >
            {file ? (
              <div className="drop-file">
                <span className="dv-ico"><Icon name="file" /></span>
                <div className="t"><b>{file.name}</b><small>{formatSize(file.size)}</small></div>
                {!uploading && <button type="button" className="link" onClick={() => setFile(null)}>바꾸기</button>}
              </div>
            ) : (
              <button type="button" className="drop-btn" onClick={() => fileInput.current?.click()}>
                <Icon name="upload" />
                <b>파일을 끌어다 놓거나 눌러서 고르세요</b>
                <small>PDF, DOCX, HWP, HWPX, TXT · 최대 {MAX_MB}MB</small>
              </button>
            )}
            <input ref={fileInput} type="file" accept={ACCEPT.join(',')} hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
          </div>

          <label className="fld">문서명
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="2027년 승진심사 운영지침" disabled={uploading} />
          </label>

          <label className={`sw ${confidential ? 'on' : ''}`}>
            <span className="sw-text">
              <b>보안 문서</b>
              <small>{confidential ? '직원 보안등급에 따라 일부 내용이 가려져 보여요' : '모든 직원이 원본 그대로 봐요'}</small>
            </span>
            <input type="checkbox" role="switch" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} disabled={uploading} />
            <span className="sw-track" aria-hidden="true"><i /></span>
          </label>

          <div className="fld-row">
            <label className="fld">담당부서
              <input value={dept} onChange={(e) => setDept(e.target.value)} disabled={uploading} />
            </label>
            <label className="fld">시행일
              <input type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} disabled={uploading} />
            </label>
          </div>

          <label className="fld">문서번호 <span className="opt">선택</span>
            <input value={docNo} onChange={(e) => setDocNo(e.target.value)} placeholder="비워두면 자동으로 매겨요" disabled={uploading} />
          </label>

          {error && <p className="error" role="alert">{error}</p>}
        </div>

        <footer className="up-foot">
          {uploading ? (
            <div className="up-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="업로드 진행률">
              <span className="bar"><i style={{ width: `${progress}%` }} /></span>
              <span className="n">{progress}%</span>
            </div>
          ) : (
            <span className="fine">등록하면 인사팀 열람 기록에 남아요</span>
          )}
          <button type="button" className="ghost" onClick={close} disabled={uploading}>취소</button>
          <button type="submit" className="solid" disabled={uploading}>{uploading ? '올리는 중' : '업로드'}</button>
        </footer>
      </form>
    </dialog>
  );
}
