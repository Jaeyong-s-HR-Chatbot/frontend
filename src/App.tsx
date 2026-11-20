import { useCallback, useEffect, useState } from 'react';
import { fetchMe, logout } from './api/client';
import { APPROVALS } from './api/hrMock';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './components/Sidebar';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { HrDashboard } from './pages/HrDashboard';
import { Approvals } from './pages/hr/Approvals';
import { Attendance } from './pages/hr/Attendance';
import { ChatLogs } from './pages/hr/ChatLogs';
import { Employees } from './pages/hr/Employees';
import { Payroll } from './pages/hr/Payroll';
import { DocManager } from './pages/DocManager';
import type { HrProps } from './pages/hr/props';
import { Regulations } from './pages/hr/Regulations';
import type { HrPage } from './pages/hr/format';
import { Toast } from './pages/hr/ui';
import { Login } from './pages/Login';
import type { Approval, Me } from './types';

const today = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
const todayIso = new Date().toISOString().slice(0, 10);

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

  const onLogout = () => { logout(); setMe(null); };

  return me.role === 'hr_admin'
    ? <HrShell key={me.employee_id} me={me} onLogout={onLogout} />
    : (
      <div className="app">
        <Sidebar me={me} onLogout={onLogout} />
        <main className="main"><EmployeeDashboard me={me} today={today} /></main>
        {/* key: 사용자가 바뀌면 대화 기록을 새로 시작 */}
        <ChatPanel key={me.employee_id} me={me} />
      </div>
    );
}

/** 인사팀(hr_admin) 화면: 왼쪽 메뉴로 ERP 화면을 오가요. 결재 처리 같은 변경은 목업이라 화면 상태에만 남아요. */
function HrShell({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [page, setPage] = useState<HrPage>('dashboard');
  const [focus, setFocus] = useState<{ empId?: string }>({});
  const [approvals, setApprovals] = useState<Approval[]>(APPROVALS);
  const [toast, notify] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => notify(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const go: HrProps['go'] = (p, opts = {}) => {
    setFocus(opts);
    setPage(p);
    document.querySelector('.main')?.scrollTo({ top: 0 });
  };

  const decide: HrProps['decide'] = (id, status, reason) => {
    const item = approvals.find((a) => a.id === id);
    setApprovals((list) => list.map((a) => (a.id === id ? { ...a, status, reason, decidedAt: todayIso } : a)));
    if (item) notify(`${item.name} · ${item.title} ${status === '승인' ? '승인했어요' : '반려했어요'}.`);
  };

  const props: HrProps = { approvals, decide, go, notify };
  const pending = approvals.filter((a) => a.status === '대기').length;
  // focus 가 바뀌면 화면을 새로 그려서 해당 사람/건이 바로 보이게 해요
  const k = `${page}-${focus.empId ?? ''}`;

  return (
    <div className="app">
      <Sidebar me={me} onLogout={onLogout} page={page} onNavigate={(p) => go(p)} pendingCount={pending} />
      <main className="main">
        {page === 'dashboard' && <HrDashboard {...props} today={today} />}
        {page === 'employees' && <Employees key={k} {...props} initialEmpId={focus.empId} />}
        {page === 'approvals' && <Approvals key={k} {...props} initialEmpId={focus.empId} />}
        {page === 'attendance' && <Attendance {...props} />}
        {page === 'payroll' && <Payroll {...props} />}
        {page === 'regulations' && <Regulations {...props} />}
        {page === 'chatlogs' && <ChatLogs {...props} />}
        {page === 'docs' && <DocManager me={me} notify={notify} />}
      </main>
      <ChatPanel me={me} />
      <Toast msg={toast} />
    </div>
  );
}
