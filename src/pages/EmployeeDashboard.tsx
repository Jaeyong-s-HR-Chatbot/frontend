import { Icon } from '../components/Icon';
import type { Me } from '../types';

// 목업: 숫자와 목록은 모두 예시 데이터예요
export function EmployeeDashboard({ me, today }: { me: Me; today: string }) {
  return (
    <>
      <div className="top">
        <div>
          <h1>좋은 하루예요, {me.name} 님</h1>
          <p>{today} · 본사 {me.dept}</p>
        </div>
        <div className="search"><Icon name="search" /><span>메뉴, 신청서, 규정 검색</span></div>
      </div>

      <div className="grid">
        <div className="card span4 kpi">
          <div className="label">남은 연차</div>
          <div className="val">11<small>/ 15일</small></div>
          <div className="bar"><i style={{ width: '73%' }} /></div>
          <div className="sub">올해 4일 사용 · 12/31에 정산</div>
        </div>
        <div className="card span4 kpi">
          <div className="label">이번 달 출장비 (예상)</div>
          <div className="val">180,000<small>원</small></div>
          <div className="sub">일비·식비 100,000 + 숙박 상한 80,000</div>
        </div>
        <div className="card span4 kpi">
          <div className="label">이수할 법정교육</div>
          <div className="val">2<small>과정</small></div>
          <div className="sub">성희롱 예방교육 마감 12/15</div>
        </div>

        <div className="card span7">
          <h2><Icon name="train" />다가오는 출장<span className="more">출장 신청서 보기</span></h2>
          <div className="ticket">
            <div className="st">서울<small>본사 · 11/20 (목) 08:30</small></div>
            <div className="line"><span />1박 2일<span /></div>
            <div className="st r">대전<small>제1지역본부 · 11/21 (금) 17:00</small></div>
          </div>
          <div className="meta">
            <span>등급 <b>3급 이하</b></span>
            <span>일비 <b>25,000</b></span>
            <span>식비 <b>25,000</b></span>
            <span>숙박 상한 <b>80,000</b></span>
            <span>정산 기한 <b>귀국 후 2주</b></span>
          </div>
        </div>

        <div className="card span5">
          <h2><Icon name="check" />내 신청 현황<span className="more">전체</span></h2>
          <div className="list">
            <div className="row"><div className="ico"><Icon name="cal" /></div><div className="t"><b>연차 1일</b><small>11/14 (금)</small></div><span className="pill ok">승인</span></div>
            <div className="row"><div className="ico"><Icon name="train" /></div><div className="t"><b>출장 · 대전 제1지역본부</b><small>11/20 – 11/21</small></div><span className="pill warn">결재 중</span></div>
            <div className="row"><div className="ico"><Icon name="heart" /></div><div className="t"><b>가족수당 신고 · 부모 2인</b><small>제출 11/03</small></div><span className="pill ok">반영</span></div>
          </div>
        </div>

        <div className="card span12">
          <div className="notice"><Icon name="bell" /><div><b>인사팀 공지</b> · 유연근무제 운영세칙이 9월 18일 개정됐어요. 시차출퇴근은 KOVIS에서 1주 단위로 신청할 수 있어요.</div></div>
        </div>
      </div>
    </>
  );
}
