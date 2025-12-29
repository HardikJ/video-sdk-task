import React, { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { JoinScreen } from "./components/JoinScreen";
import { MeetingView } from "./components/MeetingView";
import { authToken } from "./API";

function App() {
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [mode, setMode] = useState("JOIN"); // JOIN | MEETING

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      {mode === "JOIN" ? (
        <JoinScreen
          setMeetingId={setMeetingId}
          setParticipantName={setParticipantName}
          setMicOn={setMicOn}
          setWebcamOn={setWebcamOn}
          setMode={setMode}
          micOn={micOn}
          webcamOn={webcamOn}
        />
      ) : (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: participantName,
          }}
          token={authToken}
          key={meetingId} // Force remount on meeting switch
        >
          <MeetingView
            meetingId={meetingId}
            onLeave={() => setMode("JOIN")}
            onSwitchMeeting={(newMeetingId) => setMeetingId(newMeetingId)}
            token={authToken}
          />
        </MeetingProvider>
      )}
    </div>
  );
}

export default App;
