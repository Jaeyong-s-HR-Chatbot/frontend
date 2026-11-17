export type HrPage = 'dashboard' | 'employees' | 'approvals' | 'attendance' | 'payroll' | 'regulations' | 'chatlogs';

export const won = (n: number) => n.toLocaleString('ko-KR');
/** 3,833,614,090 → "38.3억" */
export const eok = (n: number) => `${(n / 1e8).toFixed(1)}억`;
