import type { Me } from '../types';
import { Icon, TrainMark, type IconName } from './Icon';

type NavItem = { icon: IconName; label: string; count?: number };

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
    { icon: 'home', label: '대시보드' },
    { icon: 'users', label: '임직원 관리' },
    { icon: 'check', label: '결재 관리', count: 14 },
    { icon: 'file', label: '규정 관리' },
    { icon: 'log', label: '챗봇 로그' },
  ],
};

export function Sidebar({ me, onLogout }: { me: Me; onLogout: () => void }) {
  return (
    <aside className="rail">
      <div className="brand">
        <TrainMark />
        <div className="brand-text"><b>누리철도</b><small>HR PORTAL</small></div>
      </div>
      <span className="rolebadge">{me.role === 'hr_admin' ? '인사팀' : '임직원'}</span>
      <div>
        <div className="navlabel">메뉴</div>
        <nav className="nav">
          {NAV[me.role].map((item, i) => (
            // 목업이라 메뉴는 대시보드만 동작해요
            <a key={item.label} href="#" className={i === 0 ? 'on' : ''} aria-current={i === 0 ? 'page' : undefined} onClick={(e) => e.preventDefault()}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.count ? <span className="count">{item.count}</span> : null}
            </a>
          ))}
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
