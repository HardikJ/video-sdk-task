import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { ParticipantView } from "./ParticipantView";
import { Controls } from "./Controls";

export function MeetingView({ meetingId, onLeave, onSwitchMeeting, token }) {
    const [joined, setJoined] = useState(null);
    const [targetRoomId, setTargetRoomId] = useState("");

    // Feature hooks
    // requestMediaRelay is available in recent SDK versions. 
    // If not, we might need to handle it via backend or it might be a no-op with alert.
    const { join, participants, localParticipant, switchTo, requestMediaRelay } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
        },
        onMeetingLeft: () => {
            onLeave();
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const joinMeeting = () => {
        setJoined("JOINING");
        join();
    };

    const handleSwitchRoom = () => {
        if (!targetRoomId) return alert("Please enter a Target Room ID");
        // Normal Switch: Leave current -> App handles switch -> Join new
        // We call onSwitchMeeting which changes key in App.jsx, forcing this component to unmount and remount with new ID.
        onSwitchMeeting(targetRoomId);
    };

    const handleMediaRelay = () => {
        if (!targetRoomId) return alert("Please enter a Target Room ID for Relay");

        // Check if requestMediaRelay exists (it should in the SDK, but safe check)
        if (typeof requestMediaRelay !== 'function') {
            return alert("Media Relay feature not supported by this SDK version or configuration.");
        }

        // Request media relay to the target room
        requestMediaRelay({
            destinationMeetingId: targetRoomId,
            token: token,
            kinds: ["audio", "video"],
        });
        alert(`Relay requested to ${targetRoomId}.`);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white">Meeting: <span className="text-blue-400 font-mono">{meetingId}</span></h3>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${joined === "JOINED" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}`}>
                        {joined === "JOINED" ? "Live" : joined === "JOINING" ? "Connecting..." : "Not Connected"}
                    </span>
                </div>

                {/* Switching Controls */}
                {joined === "JOINED" && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter Target Room ID"
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 w-48 text-white placeholder-gray-400"
                            value={targetRoomId}
                            onChange={(e) => setTargetRoomId(e.target.value)}
                        />
                        <button
                            onClick={handleSwitchRoom}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-medium transition"
                            title="Seamlessly switch to this room"
                        >
                            Switch To
                        </button>
                        <button
                            onClick={handleMediaRelay}
                            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition"
                            title="Broadcast media to this room without leaving"
                        >
                            Relay Media
                        </button>
                    </div>
                )}
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                {joined !== "JOINED" ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        {joined === "JOINING" ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="text-gray-400">Connecting to Room...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 ring-2 ring-gray-700">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                </div>
                                <button onClick={joinMeeting} className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg hover:shadow-blue-500/20 transform hover:scale-105">
                                    Join Meeting
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max justify-items-center p-4">
                        {/* Local Participant */}
                        {localParticipant && (
                            <ParticipantView participantId={localParticipant.id} />
                        )}

                        {/* Remote Participants */}
                        {[...participants.keys()].map((participantId) => {
                            if (participantId === localParticipant?.id) return null;
                            return <ParticipantView key={participantId} participantId={participantId} />;
                        })}
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            {joined === "JOINED" && (
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <Controls />
                </div>
            )}
        </div>
    );
}
