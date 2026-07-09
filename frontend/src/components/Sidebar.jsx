// import { useEffect } from "react";

// import API from "../api/axios";
// import { setUsers } from "../redux/userSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setConversations,
//   setSelectedConversation,
// } from "../redux/conversationSlice";
// import { setUser } from "../redux/authSlice";

// function Sidebar() {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.user);
//   const { user } = useSelector((state) => state.auth);
//   const { conversations } = useSelector((state) => state.conversation);
//   const getConversations = async () => {
//     try {
//       const res = await API.get("/conversations");

//       dispatch(setConversations(res.data.data));
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getConversations();
//     getAllUsers();
//   }, [dispatch]);
//   console.log("conversations in sidebar", conversations);

//   const getAllUsers = async () => {
//     try {
//       const res = await API.get("/users/all-users");

//       dispatch(setUsers(res.data.data));
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const HandleLogout = async () => {
//     try {
//       const res = await API.post("/users/logout");

//       if (res.data.success) {
//         dispatch(setUser(null));

//         localStorage.clear();

//         window.location.href = "/login";
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const openProfile = () => {
//     window.location.href = "/profile";
//   };
//   return (
//     <div
//       style={{
//         width: "30%",
//         borderRight: "1px solid gray",
//         padding: "10px",
//       }}
//     >
//       <h2>Chats</h2>
//       <div>
//         <button id="logout-button" onClick={HandleLogout}>
//           Logout
//         </button>
//       </div>
//       <div>
//         user profile
//         <div onClick={openProfile}>
//           <img
//             src={user.profilePicture}
//             alt={user.username}
//             style={{ width: "40px", height: "40px", borderRadius: "50%" }}
//           />
//         </div>
//       </div>
//       {users.map((singleUser) => {
//         const existingConversation = conversations.find(
//           (conversation) => conversation.user?._id === singleUser._id,
//         );

//         return (
//           <div
//             key={singleUser._id}
//             onClick={() =>
//               dispatch(
//                 setSelectedConversation({
//                   user: singleUser,
//                 }),
//               )
//             }
//             style={{
//               padding: "10px",
//               borderBottom: "1px solid gray",
//               cursor: "pointer",
//             }}
//           >
//             <img
//               src={singleUser.profilePicture}
//               alt={singleUser.username}
//               style={{ width: "40px", height: "40px", borderRadius: "50%" }}
//             />
//             <h1>{singleUser.isOnline ? "Online" : "Offline"}</h1>
//             <h4>{singleUser.username}</h4>

//             <p>
//               {existingConversation?.lastMessageSender?._id === user._id
//                 ? `You: ${existingConversation.lastMessage}`
//                 : existingConversation?.lastMessage || "Start conversation"}
//               {existingConversation?.lastMessageSender?._id === user._id &&
//                 " (sent)"}
//               {existingConversation?.lastMessageTime &&
//                 ` - ${new Date(
//                   existingConversation.lastMessageTime,
//                 ).toLocaleTimeString()}`}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default Sidebar;
import { useEffect } from "react";

import API from "../api/axios";
import { setUsers } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { setUser } from "../redux/authSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

  .wa-sidebar * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
  }

  .wa-sidebar {
    width: 30%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #111b21;
    border-right: 1px solid #222d34;
    overflow: hidden;
  }

  /* ── Header ── */
  .wa-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #202c33;
    flex-shrink: 0;
  }

  .wa-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .wa-avatar {
    position: relative;
    flex-shrink: 0;
  }

  .wa-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    border: 2px solid #00a884;
  }

  .wa-header-title {
    font-size: 17px;
    font-weight: 700;
    color: #e9edef;
    letter-spacing: 0.2px;
  }

  .wa-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
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

  /* ── Search bar ── */
  .wa-search-wrap {
    padding: 8px 12px;
    background: #111b21;
    flex-shrink: 0;
  }

  .wa-search {
    display: flex;
    align-items: center;
    background: #202c33;
    border-radius: 10px;
    padding: 8px 12px;
    gap: 10px;
  }

  .wa-search svg {
    color: #8696a0;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .wa-search span {
    font-size: 14px;
    color: #8696a0;
    user-select: none;
  }

  .wa-search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #e9edef;
    font-size: 14px;
    line-height: 1.3;
  }

  .wa-search-input::placeholder {
    color: #8696a0;
  }

  /* ── Section label ── */
  .wa-section-label {
    padding: 6px 16px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #8696a0;
    background: #111b21;
    flex-shrink: 0;
  }

  /* ── Conversation list ── */
  .wa-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #374045 transparent;
  }

  .wa-list::-webkit-scrollbar {
    width: 5px;
  }

  .wa-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .wa-list::-webkit-scrollbar-thumb {
    background: #374045;
    border-radius: 4px;
  }

  /* ── Conversation row ── */
  .wa-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 1px solid #1f2c34;
    transition: background 0.12s;
    position: relative;
  }

  .wa-row:hover {
    background: #202c33;
  }

  .wa-row:active {
    background: #2a3942;
  }

  .wa-row-avatar {
    position: relative;
    flex-shrink: 0;
  }

  .wa-row-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .wa-online-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #111b21;
  }

  .wa-online-dot.online {
    background: #00a884;
  }

  .wa-online-dot.offline {
    background: #8696a0;
  }

  .wa-row-body {
    flex: 1;
    min-width: 0;
  }

  .wa-row-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 3px;
  }

  .wa-username {
    font-size: 15px;
    font-weight: 600;
    color: #e9edef;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
  }

  .wa-time {
    font-size: 11.5px;
    color: #8696a0;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .wa-row-bottom {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .wa-last-msg {
    font-size: 13px;
    color: #8696a0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .wa-last-msg.you {
    color: #aebac1;
  }

  .wa-you-prefix {
    color: #00a884;
    font-weight: 600;
    margin-right: 2px;
  }

  .wa-status-icon {
    flex-shrink: 0;
    color: #53bdeb;
    display: flex;
    align-items: center;
  }

  .wa-status-icon svg {
    width: 14px;
    height: 14px;
  }

  .wa-online-badge {
    font-size: 11px;
    font-weight: 600;
    color: #00a884;
  }

  /* ── Footer / logout ── */
  .wa-footer {
    padding: 10px 16px;
    background: #202c33;
    border-top: 1px solid #222d34;
    flex-shrink: 0;
  }

  .wa-logout-btn {
    width: 100%;
    padding: 9px 0;
    background: transparent;
    border: 1px solid #374045;
    border-radius: 8px;
    color: #ea4335;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, border-color 0.15s;
    letter-spacing: 0.3px;
  }

  .wa-logout-btn:hover {
    background: #2a1a1a;
    border-color: #ea4335;
  }

  .wa-logout-btn svg {
    width: 16px;
    height: 16px;
  }

  /* ── Empty state ── */
  .wa-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    gap: 12px;
    color: #8696a0;
  }

  .wa-empty svg {
    width: 48px;
    height: 48px;
    opacity: 0.4;
  }

  .wa-empty p {
    font-size: 14px;
    text-align: center;
    line-height: 1.5;
  }
`;

function Sidebar() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.conversation);

  const getConversations = async () => {
    try {
      const res = await API.get("/conversations");
      dispatch(setConversations(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversations();
    getAllUsers();
  }, [dispatch]);

  const getAllUsers = async () => {
    try {
      const res = await API.get("/users/all-users");
      dispatch(setUsers(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const HandleLogout = async () => {
    try {
      const res = await API.post("/users/logout");
      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openProfile = () => {
    window.location.href = "/profile";
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const handleChangeInSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredUsers = users.filter((u) =>
      u.username.toLowerCase().includes(query),
    );
    if (query.length === 0) {
      getAllUsers();
      return;
    }
    dispatch(setUsers(filteredUsers));
  };
  return (
    <>
      <style>{styles}</style>
      <div className="wa-sidebar">
        {/* ── Header ── */}
        <div className="wa-header">
          <div
            className="wa-header-left"
            onClick={openProfile}
            title="View profile"
          >
            <div className="wa-avatar">
              <img src={user.profilePicture} alt={user.username} />
            </div>
            <span className="wa-header-title">Chats</span>
          </div>

          <div className="wa-header-actions">
            {/* New Chat icon */}
            <button className="wa-icon-btn" title="New chat">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            {/* Menu dots */}
            <button className="wa-icon-btn" title="Menu">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="wa-search-wrap">
          <div className="wa-search">
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
            <input
              type="text"
              className="wa-search-input text-white"
              placeholder="Search or start new chat"
              onChange={handleChangeInSearch}
            />
          </div>
        </div>

        {/* ── Section label ── */}
        <div className="wa-section-label">All Contacts</div>

        {/* ── User / conversation list ── */}
        <div className="wa-list">
          {users.length === 0 ? (
            <div className="wa-empty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>
                No contacts yet.
                <br />
                Start a conversation!
              </p>
            </div>
          ) : (
            users.map((singleUser) => {
              const existingConversation = conversations.find(
                (conversation) => conversation.user?._id === singleUser._id,
              );

              const isSentByMe =
                existingConversation?.lastMessageSender?._id === user._id;
              const lastMsg = existingConversation?.lastMessage;
              const msgTime = formatTime(existingConversation?.lastMessageTime);

              return (
                <div
                  key={singleUser._id}
                  className="wa-row"
                  onClick={() =>
                    dispatch(setSelectedConversation({ user: singleUser }))
                  }
                >
                  {/* Avatar + online dot */}
                  <div className="wa-row-avatar">
                    <img
                      src={singleUser.profilePicture}
                      alt={singleUser.username}
                    />
                    <span
                      className={`wa-online-dot ${singleUser.isOnline ? "online" : "offline"}`}
                    />
                  </div>

                  {/* Body */}
                  <div className="wa-row-body">
                    <div className="wa-row-top">
                      <span className="wa-username">{singleUser.username}</span>
                      {msgTime && <span className="wa-time">{msgTime}</span>}
                    </div>

                    <div className="wa-row-bottom">
                      {/* Double-tick for sent */}
                      {isSentByMe && lastMsg && (
                        <span className="wa-status-icon" title="Sent">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}

                      <span
                        className={`wa-last-msg ${isSentByMe && lastMsg ? "you" : ""}`}
                      >
                        {lastMsg ? (
                          <>
                            {isSentByMe && (
                              <span className="wa-you-prefix">You:</span>
                            )}
                            {lastMsg}
                          </>
                        ) : (
                          <span style={{ fontStyle: "italic" }}>
                            Start a conversation
                          </span>
                        )}
                      </span>

                      {singleUser.isOnline && (
                        <span className="wa-online-badge">●</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer / Logout ── */}
        <div className="wa-footer">
          <button
            id="logout-button"
            className="wa-logout-btn"
            onClick={HandleLogout}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
