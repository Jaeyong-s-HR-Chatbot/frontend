import { useState, type FormEvent } from 'react';
import { login, mockLogin, USE_MOCK } from '../api/client';
import { TrainMark } from '../components/Icon';
import type { Role } from '../types';

export function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) { setError('사번과 비밀번호를 입력해 주세요.'); return; }
    setBusy(true); setError('');
    try {
      await login(username, password);
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  function demo(role: Role) {
    mockLogin(role);
    onLoggedIn();
  }

  return (
    <div className="login">
      <div className="login-side">
        <div className="brand"><TrainMark /><div className="brand-text"><b>누리철도</b><small>HR PORTAL</small></div></div>
        <div>
          <h1>규정이 궁금할 때, 근거 조문까지 바로 확인하세요</h1>
          <p>연차, 수당, 출장, 교육, 복리후생 규정을 HR 도우미가 사내규정 원문을 찾아 답해요.</p>
        </div>
        <div className="board" aria-hidden="true">
          <div><span>근태</span><span>연차 15일 · 3년부터 2년마다 +1</span><span>제23조</span></div>
          <div><span>출장</span><span>광역시 숙박 상한 80,000원</span><span>별표 2</span></div>
          <div><span>복리</span><span>가족돌봄휴가 연 10일</span><span>제58조</span></div>
        </div>
      </div>

      <div className="login-form">
        <form className="login-card" onSubmit={onSubmit}>
          <h2>로그인</h2>
          <label htmlFor="username">사번
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e1584" autoComplete="username" />
          </label>
          <label htmlFor="password">비밀번호
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit" disabled={busy}>{busy ? '확인 중…' : '로그인'}</button>

          {USE_MOCK && (
            <div className="demo">
              <p>예시 모드 · 테스트 계정으로 바로 들어가기</p>
              <button type="button" onClick={() => demo('employee')}>
                <span className="av" style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}>이</span>
                <span>임직원으로 보기<small>이서준 · 신호팀 4급</small></span>
              </button>
              <button type="button" onClick={() => demo('hr_admin')}>
                <span className="av" style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}>김</span>
                <span>인사팀으로 보기<small>김수아 · 인사팀 2급</small></span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
