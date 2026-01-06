'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminChatsPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chats
  useEffect(() => {
    fetchChats();
    // Poll for new chats
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      pollingRef.current = setInterval(() => {
        pollMessages();
      }, 3000);
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedChat, messages]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/admin/chats');
      const data = await res.json();
      if (data.success) {
        setChats(data.chats);
        setTotalUnread(data.totalUnread);
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/${chat.session_id}/messages?role=admin`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        fetchChats(); // Refresh to update unread counts
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const pollMessages = async () => {
    if (!selectedChat) return;
    try {
      const lastMessage = messages[messages.length - 1];
      const after = lastMessage ? lastMessage.timestamp : null;
      const url = after 
        ? `/api/chat/${selectedChat.session_id}/messages?after=${after}&role=admin`
        : `/api/chat/${selectedChat.session_id}/messages?role=admin`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.messages && data.messages.length > 0) {
        setMessages(prev => [...prev, ...data.messages]);
      }
    } catch (error) {
      console.error('Poll messages error:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat || sending) return;

    const content = inputValue.trim();
    setInputValue('');
    setSending(true);

    // Optimistic update
    const tempMessage = {
      sender: 'admin',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await fetch(`/api/chat/${selectedChat.session_id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sender: 'admin'
        })
      });
      fetchChats(); // Update last_message in list
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px - 4rem)', gap: '1rem' }}>
      {/* Chat List */}
      <div style={{
        width: '320px',
        background: 'white',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            color: 'var(--color-vintage-coffee)',
            margin: 0
          }}>
            Chat Support
          </h2>
          {totalUnread > 0 && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.5rem',
              borderRadius: '10px'
            }}>
              {totalUnread} baru
            </span>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-vintage-brown)' }}>
              Memuat...
            </div>
          ) : chats.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-vintage-brown)' }}>
              <p>Belum ada chat</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat._id}
                onClick={() => selectChat(chat)}
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  background: selectedChat?.session_id === chat.session_id ? 'var(--color-vintage-surface)' : 'white',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    color: 'var(--color-vintage-coffee)',
                    fontWeight: chat.unread_admin > 0 ? 600 : 400
                  }}>
                    {chat.user_name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    color: 'var(--color-vintage-brown)'
                  }}>
                    {formatTime(chat.last_message_at)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--color-vintage-brown)',
                    margin: 0,
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: chat.unread_admin > 0 ? 600 : 400
                  }}>
                    {chat.last_message || 'No messages'}
                  </p>
                  {chat.unread_admin > 0 && (
                    <span style={{
                      background: 'var(--color-vintage-gold)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {chat.unread_admin}
                    </span>
                  )}
                </div>
                {chat.user_email && (
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    color: 'var(--color-vintage-brown)',
                    opacity: 0.7,
                    margin: '0.25rem 0 0'
                  }}>
                    {chat.user_email}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        background: 'white',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {!selectedChat ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-vintage-brown)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-vintage-gold)" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                Pilih chat untuk memulai
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-vintage-surface)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-vintage-coffee)',
                margin: 0
              }}>
                {selectedChat.user_name}
              </h3>
              {selectedChat.user_email && (
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  color: 'var(--color-vintage-brown)',
                  margin: '0.25rem 0 0'
                }}>
                  {selectedChat.user_email}
                </p>
              )}
            </div>

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
              {loadingMessages ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-vintage-brown)' }}>
                  Memuat pesan...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-vintage-brown)' }}>
                  Belum ada pesan
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: msg.sender === 'admin' 
                        ? '16px 16px 4px 16px' 
                        : '16px 16px 16px 4px',
                      background: msg.sender === 'admin' 
                        ? 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)' 
                        : 'white',
                      color: msg.sender === 'admin' ? 'white' : 'var(--color-vintage-coffee)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        fontSize: '0.65rem',
                        opacity: 0.7,
                        marginBottom: '0.25rem'
                      }}>
                        {msg.sender === 'admin' ? 'Anda' : selectedChat.user_name}
                      </div>
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
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '0.75rem',
              background: 'white'
            }}>
              <input
                type="text"
                placeholder="Ketik balasan..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={sending || !inputValue.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: inputValue.trim() 
                    ? 'linear-gradient(135deg, var(--color-vintage-gold) 0%, var(--color-vintage-brown) 100%)'
                    : '#e5e5e5',
                  color: inputValue.trim() ? 'white' : '#999',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: sending || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.6 : 1
                }}
              >
                {sending ? 'Mengirim...' : 'Kirim'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
