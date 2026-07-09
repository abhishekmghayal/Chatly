import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  getLocalStream,
  createPeerConnection,
  makeOffer,
  makeAnswer,
  addAnswer,
  addIceCandidate,
} from "../utils/webrtc";

const SOCKET_SERVER_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function CallUI({ room }) {
  const localRef = useRef();
  const remoteRef = useRef();
  const pcRef = useRef();
  const socketRef = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on("connect", () => setConnected(true));

    socketRef.current.on("incoming-call", async ({ from, offer }) => {
      const localStream = await getLocalStream();
      if (localRef.current) localRef.current.srcObject = localStream;

      pcRef.current = createPeerConnection(
        (stream) => {
          if (remoteRef.current) remoteRef.current.srcObject = stream;
        },
        (candidate) => {
          socketRef.current.emit("ice-candidate", { to: from, candidate });
        },
      );

      const answer = await makeAnswer(pcRef.current, offer, localStream);
      socketRef.current.emit("answer-call", {
        to: from,
        answer,
        from: socketRef.current.id,
      });
    });

    socketRef.current.on("call-accepted", async ({ from, answer }) => {
      if (pcRef.current) await addAnswer(pcRef.current, answer);
    });

    socketRef.current.on("ice-candidate", ({ candidate }) => {
      addIceCandidate(pcRef.current, candidate);
    });

    return () => {
      socketRef.current.disconnect();
      if (pcRef.current) pcRef.current.close();
    };
  }, []);

  const startCall = async (targetSocketId) => {
    const localStream = await getLocalStream();
    if (localRef.current) localRef.current.srcObject = localStream;

    pcRef.current = createPeerConnection(
      (stream) => {
        if (remoteRef.current) remoteRef.current.srcObject = stream;
      },
      (candidate) => {
        socketRef.current.emit("ice-candidate", {
          to: targetSocketId,
          candidate,
        });
      },
    );

    const offer = await makeOffer(pcRef.current, localStream);
    socketRef.current.emit("call-user", {
      to: targetSocketId,
      offer,
      from: socketRef.current.id,
    });
  };

  return (
    <div>
      <div>
        <video ref={localRef} autoPlay muted style={{ width: 200 }} />
        <video ref={remoteRef} autoPlay style={{ width: 400 }} />
      </div>
      <div>
        <input placeholder="Target socket id" id="targetId" />
        <button
          onClick={() => startCall(document.getElementById("targetId").value)}
        >
          Call
        </button>
      </div>
      <div>Status: {connected ? "connected" : "disconnected"}</div>
    </div>
  );
}
