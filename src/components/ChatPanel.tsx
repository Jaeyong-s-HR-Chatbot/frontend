import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendChat, USE_MOCK } from '../api/client';
import type { ChatMessage, Me } from '../types';
import { Icon } from './Icon';

const SUGGESTIONS: Record<Me['role'], string[]> = {
  employee: ['광역시 1박 2일 출장비는?', '올해 연차 몇 개야?', '부모님 가족수당 받을 수 있어?', '결혼하면 경조금 얼마야?'],
  hr_admin: ['가족돌봄휴가는 며칠이야?', '병가 진단서 기준은?', '출장비 숙박 상한은?'],
};

export function ChatPanel({ me }: { me: Me }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: 'bot', text: `안녕하세요, ${me.name} 님. 연차, 수당, 출장, 교육, 복리후생 규정을 물어보시면 근거 조문과 함께 알려드려요.` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await sendChat(q);
      setMessages((m) => [...m, { id: nextId.current++, from: 'bot', text: res.answer, citations: res.citations, refused: res.refused }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류';
      setMessages((m) => [...m, { id: nextId.current++, from: 'bot', text: `답변을 가져오지 못했어요. ${msg}`, refused: true }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <section className="dock" aria-label="HR 챗봇">
      <header>
        <div className="bot">
          <svg viewBox="0 0 24 24" fill="none" stroke="#F2A516" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 3v-3H6a2 2 0 0 1-2-2z" />
            <path d="M9 10h.01M15 10h.01M9.5 13.5c1.5 1 3.5 1 5 0" />
          </svg>
        </div>
        <div>
          <b>누리 HR 도우미</b>
          <small><span className={`dot ${USE_MOCK ? 'mock' : ''}`} />{USE_MOCK ? '예시 모드 · 미리 넣은 답변' : '사내규정 기반 답변 · 근거 조문 표시'}</small>
        </div>
      </header>

      <div className="msgs" ref={listRef} aria-live="polite">
        {messages.map((m) =>
          m.from === 'user' ? (
            <div key={m.id} className="m u">{m.text}</div>
          ) : (
            <div key={m.id} className="m a">
              <div className="bub">
                {m.text}
                {m.citations && m.citations.length > 0 && (
                  <div className="cites">
                    {m.citations.map((c) => (
                      <span key={c.title} className="cite"><Icon name="doc" />{c.title}</span>
                    ))}
                  </div>
                )}
                {m.refused && (
                  <div className="cites"><span className="cite refuse"><Icon name="alert" />근거 조문 없음 · 인사팀 확인 필요</span></div>
                )}
              </div>
            </div>
          ),
        )}
        {loading && <div className="m a"><div className="bub typing" aria-label="답변 작성 중"><i /><i /><i /></div></div>}
      </div>

      <div className="sugg">
        {SUGGESTIONS[me.role].map((s) => (
          <button key={s} type="button" onClick={() => ask(s)}>{s}</button>
        ))}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <div className="box">
          <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="광역시 1박 2일 출장비는 얼마예요?" aria-label="질문 입력" autoComplete="off" />
          <button type="submit" aria-label="보내기" disabled={loading || !input.trim()}><Icon name="send" /></button>
        </div>
        <p className="fine">답변은 등록된 사내규정을 기준으로 해요. 개인 상황은 인사팀에 확인해 주세요.</p>
      </form>
    </section>
  );
}
