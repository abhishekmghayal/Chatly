// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser } from "../redux/authSlice";
// import API from "../api/axios";
// function Profile() {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const [editable, setEditable] = useState(false);
//   const [formData, setFormData] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     name: user?.name || "",
//     bio: user?.bio || "",
//     profilePicture: user?.profilePicture || "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleToggle = async () => {
//     if (editable) {
//       try {
//         const res = await API.post("/users/update-profile", formData);
//         console.log(res.data);

//         dispatch(setUser({ ...user, ...res.data.user })); // preserve token + existing fields
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     setEditable(!editable);
//   };

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <form>
//         <div>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             disabled={!editable}
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             disabled={!editable}
//           />
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             disabled={!editable}
//           />
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             disabled={!editable}
//           />
//           <img src={formData.profilePicture} alt="Profile" />
//         </div>
//         <button type="button" onClick={handleToggle}>
//           {editable ? "Save" : "Edit"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Profile;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import API from "../api/axios";

const styles = `

  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

  .wa-profile * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
  }

  .wa-profile {
    min-height: 100vh;
    background: #111b21;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .wa-profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    background: #202c33;
    border-bottom: 1px solid #222d34;
  }

  .wa-profile-back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #aebac1;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
  }

  .wa-profile-back-btn:hover {
    background: #2a3942;
    color: #e9edef;
  }

  .wa-profile-back-btn svg {
    width: 22px;
    height: 22px;
  }

  .wa-profile-header-title {
    font-size: 18px;
    font-weight: 700;
    color: #e9edef;
  }

  /* ── Avatar section ── */
  .wa-profile-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 20px 24px;
    background: #202c33;
    border-bottom: 8px solid #111b21;
    gap: 12px;
  }

  .wa-profile-avatar-wrap {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .wa-profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #00a884;
    display: block;
  }

  .wa-profile-display-name {
    font-size: 20px;
    font-weight: 700;
    color: #e9edef;
  }

  .wa-profile-display-email {
    font-size: 13px;
    color: #8696a0;
  }

  /* ── Fields section ── */
  .wa-profile-fields {
    padding: 8px 0;
    background: #202c33;
    margin-top: 8px;
  }

  .wa-profile-field {
    padding: 14px 20px;
    border-bottom: 1px solid #2a3942;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .wa-profile-field:last-child {
    border-bottom: none;
  }

  .wa-field-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #00a884;
  }

  .wa-field-input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    color: #e9edef;
    width: 100%;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .wa-field-input:not(:disabled) {
    border-bottom: 1px solid #00a884;
  }

  .wa-field-input:disabled {
    cursor: default;
    color: #aebac1;
  }

  .wa-field-textarea {
    background: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    color: #e9edef;
    width: 100%;
    padding: 4px 0;
    resize: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
    line-height: 1.5;
    min-height: 60px;
    font-family: 'Nunito', sans-serif;
  }

  .wa-field-textarea:not(:disabled) {
    border-bottom: 1px solid #00a884;
  }

  .wa-field-textarea:disabled {
    cursor: default;
    color: #aebac1;
  }

  .wa-field-input::placeholder,
  .wa-field-textarea::placeholder {
    color: #8696a0;
  }

  /* ── Footer buttons ── */
  .wa-profile-footer {
    padding: 20px;
    display: flex;
    gap: 12px;
  }

  .wa-edit-btn {
    flex: 1;
    padding: 13px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    background: #00a884;
    color: #fff;
    transition: background 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .wa-edit-btn:hover {
    background: #02c497;
  }

  .wa-edit-btn:active {
    transform: scale(0.98);
  }

  .wa-edit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .wa-edit-btn svg {
    width: 18px;
    height: 18px;
  }

  .wa-cancel-btn {
    padding: 13px 20px;
    border-radius: 10px;
    border: 1px solid #374045;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    background: transparent;
    color: #aebac1;
    transition: background 0.15s;
  }

  .wa-cancel-btn:hover {
    background: #2a3942;
  }

  @keyframes wa-spin {
    to { transform: rotate(360deg); }
  }

  .wa-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: wa-spin 0.7s linear infinite;
  }
`;

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      name: user?.name || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
    });
    setEditable(false);
  };

  const handleToggle = async () => {
    if (editable) {
      try {
        setSaving(true);

        const payload = new FormData();

        payload.append("username", formData.username || "");
        payload.append("email", formData.email || "");
        payload.append("name", formData.name || "");
        payload.append("bio", formData.bio || "");

        if (profilePictureFile) {
          payload.append("profilePicture", profilePictureFile);
        }

        const res = await API.post("/users/update-profile", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUser({ ...user, ...res.data.user }));

          setFormData((prev) => ({
            ...prev,
            ...res.data.user,
          }));

          setProfilePictureFile(null);

          setEditable(false); // move here
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    } else {
      setEditable(true);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="wa-profile">
        {/* ── Header ── */}
        <div className="wa-profile-header">
          <button
            className="wa-profile-back-btn"
            onClick={() => window.history.back()}
            title="Back"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="wa-profile-header-title">Profile</span>
        </div>

        {/* ── Avatar ── */}
        <div className="wa-profile-avatar-section">
          <div className="wa-profile-avatar-wrap">
            <img
              className="wa-profile-avatar"
              src={
                formData.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={formData.username}
            />

            {editable && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setProfilePictureFile(file);

                    setFormData({
                      ...formData,
                      profilePicture: URL.createObjectURL(file),
                    });
                  }
                }}
                style={{
                  marginTop: "10px",
                  color: "white",
                }}
              />
            )}
          </div>
          <span className="wa-profile-display-name">
            {formData.name || formData.username}
          </span>
          <span className="wa-profile-display-email">{formData.email}</span>
        </div>

        {/* ── Fields ── */}
        <div className="wa-profile-fields">
          <div className="wa-profile-field">
            <span className="wa-field-label">Username</span>
            <input
              className="wa-field-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Enter username"
            />
          </div>

          <div className="wa-profile-field">
            <span className="wa-field-label">Email</span>
            <input
              className="wa-field-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Enter email"
            />
          </div>

          <div className="wa-profile-field">
            <span className="wa-field-label">Name</span>
            <input
              className="wa-field-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Enter your name"
            />
          </div>

          <div className="wa-profile-field">
            <span className="wa-field-label">Bio</span>
            <textarea
              className="wa-field-textarea"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Hey there! I am using WhatsApp."
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="wa-profile-footer">
          {editable && (
            <button
              type="button"
              className="wa-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button
            className="wa-edit-btn"
            type="button"
            onClick={handleToggle}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="wa-spinner" />
                Saving…
              </>
            ) : editable ? (
              <>
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
                Save
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
