import type { HrPage } from '../pages/hr/format';
import type { Me } from '../types';
import { Icon, TrainMark, type IconName } from './Icon';

type NavItem = { icon: IconName; label: string; count?: number; page?: HrPage };

const NAV: Record<Me['role'], NavItem[]> = {
  employee: [
    { icon: 'home', label: '대시보드' },
    { icon: 'cal', label: '근태·연차' },
    { icon: 'coin', label: '급여·수당' },
    { icon: 'train', label: '출장', count: 1 },
    { icon: 'book', label: '교육', count: 2 },
    { icon: 'heart', label: '복리후생' },
  ],
  hr_admin: [
    { icon: 'home', label: '대시보드', page: 'dashboard' },
    { icon: 'users', label: '임직원 관리', page: 'employees' },
    { icon: 'check', label: '결재 관리', page: 'approvals' },
    { icon: 'cal', label: '근태·휴가', page: 'attendance' },
    { icon: 'coin', label: '급여·수당', page: 'payroll' },
    { icon: 'file', label: '규정 관리', page: 'regulations' },
    { icon: 'log', label: '챗봇 로그', page: 'chatlogs' },
  ],
};

interface Props {
  me: Me;
  onLogout: () => void;
  /** 인사팀 화면: 지금 보고 있는 메뉴와 이동 함수, 결재 대기 건수 */
  page?: HrPage;
  onNavigate?: (page: HrPage) => void;
  pendingCount?: number;
}

export function Sidebar({ me, onLogout, page = 'dashboard', onNavigate, pendingCount }: Props) {
  return (
    <aside className="rail">
      <div className="brand">
        <TrainMark />
        <div className="brand-text"><b>누리철도</b><small>HR PORTAL</small></div>
      </div>
      <span className="rolebadge">{me.role === 'hr_admin' ? '인사팀 ERP' : '임직원'}</span>
      <div className="navwrap">
        <div className="navlabel">메뉴</div>
        <nav className="nav">
          {NAV[me.role].map((item, i) => {
            // 인사팀 메뉴는 화면을 바꾸고, 임직원 메뉴는 목업이라 대시보드만 동작해요
            const on = item.page ? item.page === page : i === 0;
            const count = item.page === 'approvals' ? pendingCount : item.count;
            return (
              <a key={item.label} href="#" className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); if (item.page) onNavigate?.(item.page); }}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {count ? <span className="count">{count}</span> : null}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="me">
        <div className="av">{me.name.slice(0, 1)}</div>
        <div className="who-text"><b>{me.name}</b><small>{me.dept} · {me.grade}</small></div>
        <button className="logout" onClick={onLogout} aria-label="로그아웃" title="로그아웃"><Icon name="logout" /></button>
      </div>
    </aside>
  );
}
