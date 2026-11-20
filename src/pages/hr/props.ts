import type { Approval, ApprovalStatus } from '../../types';
import type { HrPage } from './format';

/** 인사팀 화면들이 공통으로 받는 값 */
export interface HrProps {
  approvals: Approval[];
  /** 결재 처리 (목업: 화면 상태만 바뀌어요) */
  decide: (id: string, status: Exclude<ApprovalStatus, '대기'>, reason?: string) => void;
  /** 다른 메뉴로 이동 */
  go: (page: HrPage, opts?: { empId?: string }) => void;
  /** 화면 아래 알림 */
  notify: (msg: string) => void;
}
