// import { useState } from "react";

// import API from "../api/axios";
// import { setConversations } from "../redux/conversationSlice";
// import { useDispatch, useSelector } from "react-redux";

// import { setMessages } from "../redux/messageSlice";
// function MessageInput() {
//   const [text, setText] = useState("");
//   const dispatch = useDispatch();
//   const { selectedConversation } = useSelector((state) => state.conversation);
//   const { messages } = useSelector((state) => state.message);

//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await API.post(
//         `/messages/send-message/${selectedConversation.user._id}`,
//         {
//           text,
//         },
//       );

//       dispatch(setMessages([...messages, res.data.data]));
//       const updatedConversations = await API.get("/conversations");

//       dispatch(setConversations(updatedConversations.data.data));

//       setText("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         padding: "10px",
//         borderTop: "1px solid gray",
//       }}
//     >
//       <input
//         type="text"
//         placeholder="Type message..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         style={{
//           flex: 1,
//           padding: "10px",
//         }}
//       />

//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default MessageInput;
import { useState } from "react";

import API from "../api/axios";
import { setConversations } from "../redux/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

  .wa-input-bar * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
  }

  .wa-input-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #202c33;
    border-top: 1px solid #222d34;
    flex-shrink: 0;
  }

  /* ── Side icon buttons (emoji, attach) ── */
  .wa-input-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    color: #8696a0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }

  .wa-input-icon-btn:hover {
    color: #aebac1;
    background: #2a3942;
  }

  .wa-input-icon-btn svg {
    width: 22px;
    height: 22px;
  }

  /* ── Text input wrapper ── */
  .wa-input-wrap {
    flex: 1;
    background: #2a3942;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    min-height: 44px;
  }

  .wa-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    color: #e9edef;
    padding: 10px 0;
    resize: none;
    line-height: 1.4;
  }

  .wa-input::placeholder {
    color: #8696a0;
  }

  /* ── Send button ── */
  .wa-send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s;
    background: #00a884;
  }

  .wa-send-btn:hover {
    background: #02c497;
    transform: scale(1.05);
  }

  .wa-send-btn:active {
    transform: scale(0.96);
  }

  .wa-send-btn svg {
    width: 20px;
    height: 20px;
    color: #fff;
    margin-left: 2px; /* optical center for send arrow */
  }

  /* mic button shown when input is empty */
  .wa-mic-btn {
    background: #00a884;
  }

  .wa-mic-btn:hover {
    background: #02c497;
  }
    /* ================= IMAGE PREVIEW ================= */

.preview-container {
  position: relative;
  width: fit-content;
  margin: 10px;
  padding: 6px;
  border-radius: 16px;
  background: #111b21;
  border: 1px solid #2a3942;
}

.preview-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;

  width: 28px;
  height: 28px;

  border: none;
  border-radius: 50%;

  background: #ff4d4f;
  color: white;

  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}
`;
import { useRef } from "react";
function MessageInput() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setSelectedImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  //const [image, setImage] = useState(null);

  const sendMessage = async () => {
    if (!text.trim() && !selectedImage) return;
    try {
      const payload = new FormData();
      payload.append("text", text);
      if (selectedImage) {
        payload.append("image", selectedImage);
      }
      const res = await API.post(
        `/messages/send-message/${selectedConversation.user._id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(setMessages([...messages, res.data.data]));
      const updatedConversations = await API.get("/conversations");
      dispatch(setConversations(updatedConversations.data.data));
      setText("");
      setSelectedImage(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = !text.trim() && !selectedImage;
  const isVideoPreview = selectedImage?.type?.startsWith("video/");

  return (
    <>
      <style>{styles}</style>
      {preview && (
        <div className="preview-container">
          {isVideoPreview ? (
            <video src={preview} className="preview-image" controls />
          ) : (
            <img src={preview} alt="Preview" className="preview-image" />
          )}
          <button className="remove-image-btn" onClick={removeImage}>
            ✕
          </button>
        </div>
      )}
      <div className="wa-input-bar">
        {/* Emoji icon */}
        <button className="wa-input-icon-btn" title="Emoji">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
          </svg>
        </button>

        {/* Attach icon */}
        <button
          className="wa-input-icon-btn"
          title="Attach"
          onClick={() => fileInputRef.current.click()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="file"
          accept="image/* video/*"
          ref={fileInputRef}
          hidden
          onChange={handleImageSelect}
        />

        {/* Text input */}
        <div className="wa-input-wrap">
          <input
            className="wa-input"
            type="text"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send / Mic button */}
        {isEmpty ? (
          <button className="wa-send-btn wa-mic-btn" title="Voice message">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        ) : (
          <button className="wa-send-btn" onClick={sendMessage} title="Send">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

export default MessageInput;
