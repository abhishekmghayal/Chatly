// Minimal WebRTC helper for getUserMedia and RTCPeerConnection

const defaultConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // Add TURN servers for production: { urls: 'turn:turn.example.com', username, credential }
  ],
};

export async function getLocalStream(
  constraints = { audio: true, video: true },
) {
  return await navigator.mediaDevices.getUserMedia(constraints);
}

export function createPeerConnection(
  onTrack,
  onIceCandidate,
  config = defaultConfig,
) {
  const pc = new RTCPeerConnection(config);

  pc.onicecandidate = (event) => {
    if (event.candidate && onIceCandidate) onIceCandidate(event.candidate);
  };

  pc.ontrack = (event) => {
    if (onTrack) onTrack(event.streams[0]);
  };

  return pc;
}

export async function makeOffer(pc, localStream) {
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function makeAnswer(pc, remoteOffer, localStream) {
  await pc.setRemoteDescription(remoteOffer);
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

export async function addAnswer(pc, answer) {
  await pc.setRemoteDescription(answer);
}

export function addIceCandidate(pc, candidate) {
  if (!candidate) return;
  pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
}
