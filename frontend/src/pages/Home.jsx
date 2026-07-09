import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

import socket from "../socket/socket";

import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer";

function Home() {
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  return (
    <div className="home-shell">
      <Sidebar />

      <ChatContainer />
    </div>
  );
}

export default Home;
