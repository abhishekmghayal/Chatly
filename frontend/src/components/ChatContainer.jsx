import MessageInput from "./MessageInput";
import { useEffect, useRef } from "react";
import socket from "../socket/socket";
import API from "../api/axios";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../redux/conversationSlice";
import { setMessages } from "../redux/messageSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

  .wa-chat * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
  }

  /* ── Empty / no conversation selected ── */
  .wa-chat-empty {
    width: 70%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #111b21;
    border-left: 1px solid #222d34;
  }

  .wa-chat-empty-icon {
    width: 80px;
    height: 80px;
    background: #202c33;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wa-chat-empty-icon svg {
    width: 40px;
    height: 40px;
    color: #00a884;
  }

  .wa-chat-empty h3 {
    font-size: 18px;
    font-weight: 600;
    color: #e9edef;
  }

  .wa-chat-empty p {
    font-size: 13px;
    color: #8696a0;
    text-align: center;
    max-width: 260px;
    line-height: 1.6;
  }

  /* ── Main container ── */
  .wa-chat {
    width: 70%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #111b21;
    border-left: 1px solid #222d34;
    overflow: hidden;
  }

  /* ── Chat header ── */
  .wa-chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #202c33;
    border-bottom: 1px solid #222d34;
    flex-shrink: 0;
    gap: 12px;
  }

  .wa-chat-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .wa-chat-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid #374045;
  }

  .wa-chat-user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .wa-chat-username {
    font-size: 16px;
    font-weight: 700;
    color: #e9edef;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .wa-chat-status {
    font-size: 12px;
    color: #00a884;
    font-weight: 500;
  }

  .wa-chat-status.offline {
    color: #8696a0;
  }

  .wa-chat-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .wa-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    color: #aebac1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
  }

  .wa-icon-btn:hover {
    background: #2a3942;
    color: #e9edef;
  }

  .wa-icon-btn svg {
    width: 20px;
    height: 20px;
  }

  .wa-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    color: #ea4335;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .wa-close-btn:hover {
    background: #2a1a1a;
  }

  .wa-close-btn svg {
    width: 20px;
    height: 20px;
  }

  /* ── Messages area ── */
  .wa-messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px 12px;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-color: #0b141a;
    scrollbar-width: thin;
    scrollbar-color: #374045 transparent;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .wa-messages-area::-webkit-scrollbar {
    width: 5px;
  }

  .wa-messages-area::-webkit-scrollbar-thumb {
    background: #374045;
    border-radius: 4px;
  }

  /* ── Empty messages ── */
  .wa-no-messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 10px;
    padding: 32px;
  }

  .wa-no-messages-pill {
    background: #182229;
    border: 1px solid #222d34;
    border-radius: 20px;
    padding: 8px 20px;
    font-size: 13px;
    color: #8696a0;
    text-align: center;
  }

  /* ── Date divider ── */
  .wa-date-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0 8px;
  }

  .wa-date-label {
    background: #182229;
    border: 1px solid #222d34;
    padding: 4px 14px;
    border-radius: 12px;
    font-size: 11.5px;
    color: #8696a0;
    font-weight: 600;
  }

  /* ── Message bubble ── */
  .wa-msg-row {
    display: flex;
    margin-bottom: 2px;
  }

  .wa-msg-row.mine {
    justify-content: flex-end;
  }

  .wa-msg-row.theirs {
    justify-content: flex-start;
  }

  .wa-bubble {
    position: relative;
    max-width: 65%;
    padding: 7px 12px 18px 12px;
    border-radius: 8px;
    font-size: 14.5px;
    line-height: 1.5;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }

  .wa-bubble.mine {
    background: #005c4b;
    color: #e9edef;
    border-top-right-radius: 2px;
  }

  .wa-bubble.theirs {
    background: #202c33;
    color: #e9edef;
    border-top-left-radius: 2px;
  }

  .wa-bubble-meta {
    position: absolute;
    bottom: 4px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .wa-bubble-time {
    font-size: 10.5px;
    color: #8696a0;
    white-space: nowrap;
  }

  .wa-bubble.mine .wa-bubble-time {
    color: #8eb6a8;
  }

  .wa-tick {
    display: flex;
    align-items: center;
    color: #53bdeb;
  }

  .wa-tick svg {
    width: 14px;
    height: 14px;
  }
`;

function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?.user?._id) return;
      try {
        dispatch(setMessages([]));
        const res = await API.get(
          `/messages/get-messages/${selectedConversation.user._id}`,
        );
        dispatch(setMessages(res.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [selectedConversation, dispatch]);

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
      socket.off("newMessage");
    };
  }, [messages, dispatch]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMsgTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedConversation) {
    return (
      <>
        <style>{styles}</style>
        <div className="wa-chat-empty wa-chat">
          <div className="wa-chat-empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>Select a conversation</h3>
          <p>Choose a contact from the left to start chatting</p>
        </div>
      </>
    );
  }

  const otherUser = selectedConversation?.user;

  return (
    <>
      <style>{styles}</style>
      <div className="wa-chat">
        {/* ── Header ── */}
        <div className="wa-chat-header">
          <div className="wa-chat-header-left">
            <img
              className="wa-chat-avatar"
              src={otherUser?.profilePicture}
              alt={otherUser?.username}
            />
            <div className="wa-chat-user-info">
              <span className="wa-chat-username">{otherUser?.username}</span>
              <span
                className={`wa-chat-status ${otherUser?.isOnline ? "" : "offline"}`}
              >
                {otherUser?.isOnline ? "online" : "offline"}
              </span>
            </div>
          </div>

          <div className="wa-chat-header-actions">
            {/* Search */}
            <button className="wa-icon-btn" title="Search messages">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {/* Close */}
            <button
              className="wa-close-btn"
              title="Close conversation"
              onClick={() => {
                dispatch(setSelectedConversation(null));
                dispatch(setMessages([]));
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="wa-messages-area">
          {messages.length === 0 ? (
            <div className="wa-no-messages">
              <div className="wa-no-messages-pill">
                No messages yet — say hello! 👋
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => {
                const isMyMessage = message.sender._id === user._id;

                // Date divider between days
                const msgDate = new Date(message.createdAt).toDateString();
                const prevDate =
                  idx > 0
                    ? new Date(messages[idx - 1].createdAt).toDateString()
                    : null;
                const showDivider = idx === 0 || msgDate !== prevDate;
                const dividerLabel = (() => {
                  const today = new Date().toDateString();
                  const yesterday = new Date(
                    Date.now() - 86400000,
                  ).toDateString();
                  if (msgDate === today) return "Today";
                  if (msgDate === yesterday) return "Yesterday";
                  return new Date(message.createdAt).toLocaleDateString([], {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                })();

                return (
                  <div key={message._id}>
                    {showDivider && (
                      <div className="wa-date-divider">
                        <span className="wa-date-label">{dividerLabel}</span>
                      </div>
                    )}
                    <div
                      className={`wa-msg-row ${isMyMessage ? "mine" : "theirs"}`}
                    >
                      <div
                        className={`wa-bubble ${isMyMessage ? "mine" : "theirs"}`}
                      >
                        {message.image && (
                          <img
                            src={message.image}
                            alt="chat"
                            style={{
                              width: "220px",
                              maxWidth: "100%",
                              borderRadius: "12px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        )}
                        {message.video && (
                          <video
                            controls
                            src={message.video}
                            style={{
                              width: "220px",
                              maxWidth: "100%",
                              borderRadius: "12px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        )}
                        {message.text && (
                          <p
                            style={{
                              marginBottom:
                                message.image || message.video ? "8px" : "0px",
                            }}
                          >
                            {message.text}
                          </p>
                        )}
                        <div className="wa-bubble-meta">
                          <span className="wa-bubble-time">
                            {formatMsgTime(message.createdAt)}
                          </span>
                          {isMyMessage && (
                            <span className="wa-tick">
                              {message.isSeen ? (
                                // DOUBLE TICK (seen)
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <polyline
                                    points="1 14 5 18 13 10"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <polyline
                                    points="9 14 13 18 21 10"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                // SINGLE TICK (sent)
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <polyline
                                    points="4 12 9 17 20 6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Message input ── */}
        <MessageInput />
      </div>
    </>
  );
}

export default ChatContainer;
