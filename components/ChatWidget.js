'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('kopiku_chat_session');
    if (savedSession) {
      try {
        const { session_id, user_name } = JSON.parse(savedSession);
        setSessionId(session_id);
        setUserName(user_name);
        setIsStarted(true);
        loadChat(session_id);
      } catch (e) {
        localStorage.removeItem('kopiku_chat_session');
      }
    }
  }, []);

  // Polling for new messages
  useEffect(() => {
    if (isStarted && sessionId && isOpen) {
      pollingRef.current = setInterval(() => {
        pollMessages();
      }, 3000);
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isStarted, sessionId, isOpen, messages]);

  // Reset unread when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const loadChat = async (sid) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat?session_id=${sid}`);
      const data = await res.json();
      if (data.success && data.chat) {
        setMessages(data.chat.messages || []);
      }
    } catch (error) {
      console.error('Load chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pollMessages = async () => {
    if (!sessionId) return;
    try {
      const lastMessage = messages[messages.length - 1];
      const after = lastMessage ? lastMessage.timestamp : null;
      const url = after 
        ? `/api/chat/${sessionId}/messages?after=${after}&role=customer`
        : `/api/chat/${sessionId}/messages?role=customer`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.messages && data.messages.length > 0) {
        setMessages(prev => [...prev, ...data.messages]);
        // Count unread admin messages when widget is closed
        if (!isOpen) {
          const adminMessages = data.messages.filter(m => m.sender === 'admin');
          setUnreadCount(prev => prev + adminMessages.length);
        }
      }
    } catch (error) {
      console.error('Poll messages error:', error);
    }
  };

  const startChat = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName,
          user_email: userEmail || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.chat.session_id);
        setIsStarted(true);
        localStorage.setItem('kopiku_chat_session', JSON.stringify({
          session_id: data.chat.session_id,
          user_name: userName
        }));
      }
    } catch (error) {
      console.error('Start chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || sending) return;

    const content = inputValue.trim();
    setInputValue('');
    setSending(true);

    // Optimistic update
    const tempMessage = {
      sender: 'customer',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await fetch(`/api/chat/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sender: 'customer'
        })
      });
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem('kopiku_chat_session');
    setSessionId(null);
    setIsStarted(false);
    setMessages([]);
    setUserName('');
    setUserEmail('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        
        {/* Unread Badge */}
        {unreadCount > 0 && !isOpen && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: '380px',
          maxWidth: 'calc(100vw - 2rem)',
          height: '500px',
          maxHeight: 'calc(100vh - 10rem)',
          background: 'var(--color-vintage-cream)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9998,
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-vintage-coffee) 0%, var(--color-vintage-charcoal) 100%)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-vintage-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-coffee)" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: 'var(--color-vintage-cream)'
                }}>
                  KopiKu Support
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-vintage-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e'
                  }}></span>
                  {isStarted ? `Chat dengan ${userName}` : 'Online'}
                </div>
              </div>
            </div>
            {isStarted && (
              <button
                onClick={clearChat}
                title="New chat"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-beige)" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!isStarted ? (
              /* Start Form */
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: 'var(--color-vintage-coffee)',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  💬 Mulai Percakapan
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-vintage-brown)',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Terhubung langsung dengan tim support kami!
                </p>
                <form onSubmit={startChat}>
                  <input
                    type="text"
                    placeholder="Nama Anda *"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email (opsional)"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !userName.trim()}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: loading ? 'wait' : 'pointer',
                      opacity: loading || !userName.trim() ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Memulai...' : 'Mulai Chat'}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  background: 'linear-gradient(180deg, rgba(201,169,97,0.05) 0%, rgba(201,169,97,0.1) 100%)'
                }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-vintage-brown)', padding: '2rem' }}>
                      Memuat pesan...
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem 1rem',
                      color: 'var(--color-vintage-brown)'
                    }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Halo {userName}! 👋
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', opacity: 0.7 }}>
                        Admin akan segera merespons pesan Anda
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: msg.sender === 'customer' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: '80%',
                          padding: '0.75rem 1rem',
                          borderRadius: msg.sender === 'customer' 
                            ? '16px 16px 4px 16px' 
                            : '16px 16px 16px 4px',
                          background: msg.sender === 'customer' 
                            ? 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)' 
                            : 'white',
                          color: msg.sender === 'customer' ? 'white' : 'var(--color-vintage-coffee)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {msg.sender === 'admin' && (
                            <div style={{
                              fontSize: '0.65rem',
                              color: 'var(--color-vintage-gold)',
                              marginBottom: '0.25rem',
                              fontWeight: 600
                            }}>
                              Admin
                            </div>
                          )}
                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9rem',
                            margin: 0,
                            lineHeight: 1.4
                          }}>
                            {msg.content}
                          </p>
                          <p style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.65rem',
                            opacity: 0.6,
                            margin: '0.25rem 0 0',
                            textAlign: 'right'
                          }}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={{
                  padding: '1rem',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '0.75rem',
                  background: 'white'
                }}>
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '24px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputValue.trim()}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: inputValue.trim() 
                        ? 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)'
                        : '#e5e5e5',
                      border: 'none',
                      cursor: sending || !inputValue.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: sending ? 0.6 : 1
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={inputValue.trim() ? 'white' : '#999'} strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
