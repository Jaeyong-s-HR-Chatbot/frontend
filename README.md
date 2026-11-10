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
| `VITE_API_URL` 비움 (기본) | 예시 모드. 로그인 화면의 테스트 계정 버튼으로 들어가고, 챗봇은 미리 넣은 답변으로 동작 |
| `VITE_API_URL=http://localhost:8000`, `VITE_USE_MOCK=false` | FastAPI 서버에 연결 |

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
  api/mock.ts          테스트 계정, 예시 답변
  components/Sidebar   왼쪽 메뉴 (역할별 메뉴)
  components/ChatPanel 오른쪽 챗봇
  pages/Login          로그인
  pages/EmployeeDashboard, HrDashboard
  styles.css           디자인 (색, 레이아웃)
```
