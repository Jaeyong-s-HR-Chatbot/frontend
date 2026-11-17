# 누리철도 HR 포털 (프론트엔드 목업)

임직원 / 인사팀 역할에 따라 화면이 바뀌고, 오른쪽에 HR 챗봇 패널이 있는 목업이에요.
대시보드의 숫자와 목록은 모두 예시 데이터라 동작하지 않아요.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 을 열면 돼요.

## 예시 모드와 실제 서버

`.env.example`을 `.env`로 복사해서 설정해요.

| 설정 | 동작 |
| --- | --- |
| `VITE_API_URL` 비움 (기본) | 예시 모드. 사번 + 테스트 비밀번호 `Test1234!`(DB `generate.py`의 `TEST_PASSWORD`)로 로그인하거나 테스트 계정 버튼으로 들어가고, 챗봇은 미리 넣은 답변으로 동작 |
| `VITE_API_URL=http://localhost:8000`, `VITE_USE_MOCK=false` | FastAPI 서버에 연결 |

### 예시 모드 계정

DB `data/meta/demo_personas.json`의 데모 계정 10명과 인사팀장(E1003)을 쓸 수 있어요. 사번은 대소문자 상관없어요.
역할은 DB와 같은 규칙으로 정해져요: **인사팀 소속이면 `hr_admin`(인사팀 ERP 화면)**, 나머지는 `employee`.

| 사번 | 이름 | 소속 | 화면 |
| --- | --- | --- | --- |
| e1307 | 김수아 | 인사팀 2급 | 인사팀 ERP |
| e1003 | 송정식 | 인사팀 1급 (팀장) | 인사팀 ERP |
| e1584 | 이서준 | 신호팀 4급 | 임직원 |
| e1412, e1377, e1265, e1367, e1016, e1764, e1465, e1331 | 그 밖의 데모 계정 | | 임직원 |

## 인사팀 ERP 화면 (목업)

왼쪽 메뉴로 오가요. 결재 처리, 통보, 수당 반영 같은 버튼은 화면 상태만 바꾸고 서버로 보내지 않아요 (새로고침하면 처음으로 돌아가요).

| 메뉴 | 내용 |
| --- | --- |
| 대시보드 | 결재 대기·챗봇 질문·휴직자 요약, 결재 대기 바로 승인/반려, 본부별 인원, 이번 달 할 일 |
| 임직원 관리 | 사번·이름·부서 검색, 본부·재직 상태 필터, 상세 서랍(연차·10월 급여, 주민번호·계좌는 가림) |
| 결재 관리 | 대기/처리 완료, 종류 필터, 규정 자동 점검 결과와 근거 조문, 반려 사유 입력, 규정 일치 건 일괄 승인 |
| 근태·휴가 | 연차 사용 촉진 대상과 통보, 교대·교번 충원 현황, 휴직·장기휴가, 출장 |
| 급여·수당 | 11월 급여 진행 단계, 10월 지급 요약·본부별 합계, 이번 달 수당 변경 반영, 급여 대장 |
| 규정 관리 | 등록 규정 33개, 검색되는 조문 조각 비율, 다시 색인 |
| 챗봇 로그 | 질문 목록(부서까지만 표시), 근거 없음 응답 필터, 규정 보완 요청 |

임직원·급여·규정 숫자는 DB 저장소 데모 데이터에서 뽑은 값(`src/api/hrData.ts`)이고, 결재·챗봇 로그·근태 일부는 데모 계정 시나리오에 맞춰 만든 예시(`src/api/hrMock.ts`)예요. 결재 화면의 조문 번호는 예시라 실제 규정과 맞춰 봐야 해요.

## 프론트가 기대하는 API (FastAPI)

| 요청 | 보내는 값 | 받는 값 |
| --- | --- | --- |
| `POST /auth/login` | `{ username, password }` | `{ access_token }` |
| `GET /me` | `Authorization: Bearer <token>` | `{ employee_id, name, dept, grade, role }` (`role`: `employee` / `hr_admin`) |
| `POST /chat` | `{ message }` + 토큰 | `{ answer, citations: [{ title }], refused }` |

- 사번은 프론트에서 보내지 않아요. 서버가 토큰에서 꺼내 HR Tool에 넣어요.
- `refused: true`면 화면에 "근거 조문 없음 · 인사팀 확인 필요"가 표시돼요.
- 개발 중에는 FastAPI에 CORS로 `http://localhost:5173`을 허용해야 해요.

## 파일 구조

```
src/
  api/client.ts        API 호출 (예시 모드면 mock.ts 사용)
  api/mock.ts          테스트 계정(사번 로그인), 예시 답변
  api/hrData.ts        DB 데모 데이터에서 뽑은 임직원·급여·규정 예시
  api/hrMock.ts        결재·챗봇 로그 예시
  components/Sidebar   왼쪽 메뉴 (역할별 메뉴, 인사팀은 화면 이동)
  components/ChatPanel 오른쪽 챗봇
  pages/Login          로그인
  pages/EmployeeDashboard, HrDashboard
  pages/hr/            인사팀 ERP 화면 (Employees, Approvals, Attendance, Payroll, Regulations, ChatLogs)
  styles.css           디자인 (색, 레이아웃)
```
