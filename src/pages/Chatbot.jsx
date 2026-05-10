import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Bot, Loader2, Send, Sparkles, UserRound } from 'lucide-react';
import { getRecommendedSchemes } from '../data/schemes.js';
import { askGemini } from '../services/gemini.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getChatHistory, saveChatHistory } from '../services/firestore.js';

function createWelcomeMessage(recommendations, t) {
  const topScheme = recommendations[0]?.title || 'Skill India Training Pathway';

  return {
    role: 'assistant',
    text: t('chat.welcome', { scheme: topScheme })
  };
}

export default function Chatbot({ profile }) {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const recommendations = useMemo(() => getRecommendedSchemes(profile), [profile]);
  const starterPrompts = [t('chat.promptEligible'), t('chat.promptExplain'), t('chat.promptDocuments'), t('chat.promptStudents'), t('chat.promptApply')];
  const [messages, setMessages] = useState(() => [createWelcomeMessage(recommendations, t)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const lastRequestId = useRef(0);

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0].role !== 'assistant') return current;
      return [createWelcomeMessage(recommendations, t)];
    });
  }, [recommendations, t]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!user?.uid) return;

      try {
        const firebaseMessages = await getChatHistory(user.uid);
        if (!cancelled && Array.isArray(firebaseMessages) && firebaseMessages.length > 0) {
          setMessages(firebaseMessages);
        }
      } catch (historyError) {
        console.warn('Unable to load chat history:', historyError);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  async function sendMessage(messageText = input) {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || isLoading) return;

    const requestId = lastRequestId.current + 1;
    lastRequestId.current = requestId;
    setError('');
    setInput('');
    setIsLoading(true);

    const userMessage = { role: 'user', text: cleanMessage };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    if (user?.uid) {
      saveChatHistory(user.uid, nextMessages).catch((historyError) => {
        console.warn('Unable to save chat history:', historyError);
      });
    }

    try {
      const aiResponse = await askGemini({
        userMessage: cleanMessage,
        messages: nextMessages,
        profile,
        recommendations,
        responseLanguage: currentLanguage.geminiLabel
      });

      if (lastRequestId.current !== requestId) return;
      const assistantMessage = { role: 'assistant', text: aiResponse };
      setMessages((current) => {
        const updatedMessages = [...current, assistantMessage];
        if (user?.uid) {
          saveChatHistory(user.uid, updatedMessages).catch((historyError) => {
            console.warn('Unable to save chat history:', historyError);
          });
        }
        return updatedMessages;
      });
    } catch (apiError) {
      if (lastRequestId.current !== requestId) return;
      setError(apiError.message || 'Something went wrong while contacting Gemini.');
    } finally {
      if (lastRequestId.current === requestId) {
        setIsLoading(false);
      }
    }
  }

  return (
    <main className="ambient-section px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(21,112,239,0.18),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_18%_8%,rgba(21,112,239,0.26),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.16),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="premium-card rounded-lg p-5 shadow-glow lg:sticky lg:top-24 lg:h-fit">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-civic-600 to-emerald-500 text-white shadow-glow">
              <Bot size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-civic-700 dark:text-civic-100">{t('chat.badge')}</p>
              <h1 className="text-2xl font-black tracking-tight">{t('chat.title')}</h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('chat.subtitle')}</p>

          <div className="mt-5 rounded-lg border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('chat.currentProfile')}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <ProfilePill label={t('eligibility.age')} value={profile.age} />
              <ProfilePill label={t('dashboard.income')} value={`Rs. ${Number(profile.income).toLocaleString('en-IN')}`} />
              <ProfilePill label={t('eligibility.state')} value={profile.state} />
              <ProfilePill label={t('dashboard.role')} value={profile.occupation} />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold">{t('chat.suggestedPrompts')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-civic-200 bg-civic-50 px-3 py-2 text-left text-xs font-semibold text-civic-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-civic-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-civic-400/20 dark:bg-civic-500/10 dark:text-civic-100"
                >
                  <Sparkles className="mr-1 inline" size={13} />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-card flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-lg shadow-glow">
          <div className="border-b border-slate-200/80 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-civic-600 to-emerald-500 text-white shadow-glow">
                    <Bot size={22} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
                </div>
                <div>
                  <p className="font-bold">SchemeWise AI</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{isLoading ? t('chat.thinking') : t('chat.online')}</p>
                </div>
              </div>
              <div className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200 sm:block">
                {recommendations.length} {t('chat.matchesFound')}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto bg-white/40 p-4 dark:bg-slate-950/30 sm:p-6">
            {messages.map((message, index) => (
              <ChatBubble key={`${message.role}-${index}`} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-end gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-civic-600 text-white">
                  <Bot size={17} />
                </span>
                <div className="rounded-lg rounded-bl-sm border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                    <Loader2 className="animate-spin text-civic-600" size={16} />
                    {t('chat.loading')}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="font-semibold">{t('chat.errorTitle')}</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>

          <form
            className="border-t border-slate-200/80 bg-white/80 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <div className="flex items-end gap-3 rounded-lg border border-slate-200/80 bg-white/90 p-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
              <textarea
                className="max-h-28 min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t('chat.placeholder')}
              />
              <button
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-civic-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
                <span className="hidden sm:inline">{t('chat.send')}</span>
              </button>
            </div>
            <p className="mt-2 px-1 text-xs text-slate-500 dark:text-slate-400">{t('chat.note')}</p>
          </form>
        </section>
      </div>
    </main>
  );
}

function ProfilePill({ label, value }) {
  return (
    <div className="rounded-lg bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:bg-slate-950/60">
      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-civic-600 to-emerald-500 text-white shadow-sm">
          <Bot size={17} />
        </span>
      )}
      <div
        className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[74%] ${
          isUser
            ? 'rounded-br-sm bg-gradient-to-r from-civic-600 to-emerald-600 text-white shadow-md'
            : 'rounded-bl-sm border border-slate-200/80 bg-white/90 text-slate-800 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100'
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <UserRound size={17} />
        </span>
      )}
    </div>
  );
}
