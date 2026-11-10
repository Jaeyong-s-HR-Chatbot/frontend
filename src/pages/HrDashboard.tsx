import { Icon } from '../components/Icon';

// 목업: 숫자와 목록은 모두 예시 데이터예요
const PENDING = [
  { name: '박철도', dept: '제1지역본부 · 역무', kind: '연차', period: '11/17 – 11/18' },
  { name: '이선로', dept: '차량정비단 · 정비', kind: '가족돌봄휴가', period: '11/12' },
  { name: '최승무', dept: '제2지역본부 · 승무', kind: '출장 정산', period: '11/03 – 11/04' },
  { name: '김누리', dept: '본사 · 경영지원', kind: '출장', period: '11/20 – 11/21' },
];

const CATEGORIES = [
  { label: '근태관리', n: 112 },
  { label: '수당', n: 83 },
  { label: '출장', n: 68 },
  { label: '기타 복리후생', n: 49 },
  { label: '생애이벤트', n: 43 },
  { label: '교육', n: 25 },
];

export function HrDashboard({ today }: { today: string }) {
  const max = Math.max(...CATEGORIES.map((c) => c.n));
  return (
    <>
      <div className="top">
        <div>
          <h1>인사팀 대시보드</h1>
          <p>{today} · 임직원 800명</p>
        </div>
        <div className="search"><Icon name="search" /><span>사번, 이름, 부서 검색</span></div>
      </div>

      <div className="grid">
        <div className="card span3 kpi"><div className="label">결재 대기</div><div className="val">14<small>건</small></div><div className="sub">오늘 들어온 5건</div></div>
        <div className="card span3 kpi"><div className="label">오늘 챗봇 질문</div><div className="val">57<small>건</small></div><div className="sub">어제보다 12건 많음</div></div>
        <div className="card span3 kpi"><div className="label">근거 없음 응답</div><div className="val">6<small>%</small></div><div className="sub">규정에 없는 질문 4건</div></div>
        <div className="card span3 kpi"><div className="label">이번 주 휴가자</div><div className="val">38<small>명</small></div><div className="sub">교대근무 부서 21명</div></div>

        <div className="card span8">
          <h2><Icon name="check" />결재 대기<span className="more">전체 14건</span></h2>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>신청자</th><th>부서 · 직무</th><th>내용</th><th>기간</th><th /></tr></thead>
              <tbody>
                {PENDING.map((p) => (
                  <tr key={p.name + p.kind}>
                    <td><div className="who"><div className="av">{p.name.slice(0, 1)}</div>{p.name}</div></td>
                    <td>{p.dept}</td>
                    <td>{p.kind}</td>
                    <td>{p.period}</td>
                    <td><div className="act"><button type="button">반려</button><button type="button" className="p">승인</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card span4">
          <h2><Icon name="log" />챗봇 질문 분야 · 이번 주</h2>
          <div className="cat">
            {CATEGORIES.map((c) => (
              <div key={c.label}>
                <span>{c.label}</span>
                <span className="track"><i style={{ width: `${Math.round((c.n / max) * 100)}%` }} /></span>
                <span className="n">{c.n}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card span12">
          <div className="notice"><Icon name="alert" /><div><b>규정에 없는 질문</b> · 경조금·결혼 휴가, 주택자금 지원 문의가 이번 주 4건 들어왔어요. 규정 보완이 필요한지 검토해 주세요.</div></div>
        </div>
      </div>
    </>
  );
}
