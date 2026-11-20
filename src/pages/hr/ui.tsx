import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import type { Approval, ApprovalStatus } from '../../types';

export function PageTop({ title, sub, search }: { title: string; sub: string; search?: ReactNode }) {
  return (
    <div className="top">
      <div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {search}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="search input">
      <Icon name="search" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}

/** 여러 값 중 하나를 고르는 칩 묶음 */
export function Chips<T extends string>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: string; count?: number }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className={o.value === value ? 'on' : ''} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}{o.count !== undefined && <span>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function StatusPill({ status }: { status: ApprovalStatus | string }) {
  const cls = status === '승인' || status === '재직' ? 'ok' : status === '반려' || status === '퇴직' ? 'bad' : status === '대기' || status === '휴직' ? 'warn' : 'neu';
  return <span className={`pill ${cls}`}>{status}</span>;
}

/** 반려 사유를 받는 작은 창 */
export function RejectDialog({ item, onCancel, onConfirm }: { item: Approval; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div className="overlay" onClick={onCancel}>
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="reject-title" onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (reason.trim()) onConfirm(reason.trim()); }}>
        <h3 id="reject-title">반려 사유</h3>
        <p>{item.name} · {item.title}</p>
        <textarea ref={ref} value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="신청자에게 보여줄 사유를 적어 주세요" />
        <div className="act end">
          <button type="button" onClick={onCancel}>취소</button>
          <button type="submit" className="danger" disabled={!reason.trim()}>반려</button>
        </div>
      </form>
    </div>
  );
}

/** 화면 아래에 잠깐 뜨는 알림 (상태와 타이머는 App 에서 관리) */
export function Toast({ msg }: { msg: string | null }) {
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}
