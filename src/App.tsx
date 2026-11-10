import { useCallback, useEffect, useState } from 'react';
import { fetchMe, logout } from './api/client';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './components/Sidebar';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { HrDashboard } from './pages/HrDashboard';
import { Login } from './pages/Login';
import type { Me } from './types';

const today = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());

export default function App() {
  const [me, setMe] = useState<Me | null>(null);
  const [checking, setChecking] = useState(true);

  // 로그인 상태 확인: /me 로 역할(employee / hr_admin)을 받아와요
  const loadMe = useCallback(async () => {
    try {
      setMe(await fetchMe());
    } catch {
      setMe(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  if (checking) return null;
  if (!me) return <Login onLoggedIn={loadMe} />;

  return (
    <div className="app">
      <Sidebar me={me} onLogout={() => { logout(); setMe(null); }} />
      <main className="main">
        {me.role === 'hr_admin' ? <HrDashboard today={today} /> : <EmployeeDashboard me={me} today={today} />}
      </main>
      {/* key: 사용자가 바뀌면 대화 기록을 새로 시작 */}
      <ChatPanel key={me.employee_id} me={me} />
    </div>
  );
}
