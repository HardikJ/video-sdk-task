import React, { useState } from "react";
import { authToken, createMeeting } from "../API";

export function JoinScreen({ setToken, setMeetingId, setParticipantName, setMicOn, setWebcamOn, setMode, micOn, webcamOn }) {
    const [name, setName] = useState("John Doe");
    const [meetingIdInput, setMeetingIdInput] = useState("");

    const handleJoin = async () => {
        if (!name) return alert("Please provide a name");
        setParticipantName(name);

        let id = meetingIdInput;
        if (!id) {
            id = await createMeeting({ token: authToken });
        }
        setMeetingId(id);
        setMode("MEETING");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-950">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    VideoSDK Room Switcher
                </h1>

                <div className="space-y-4">


                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Participant Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Meeting ID</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="Enter Meeting ID (or leave blank to create)"
                            value={meetingIdInput}
                            onChange={(e) => setMeetingIdInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={() => setMicOn(!micOn)}
                            className={`flex-1 py-2 rounded-lg font-medium transition ${micOn ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {micOn ? "Mic On" : "Mic Off"}
                        </button>
                        <button
                            onClick={() => setWebcamOn(!webcamOn)}
                            className={`flex-1 py-2 rounded-lg font-medium transition ${webcamOn ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {webcamOn ? "Camera On" : "Camera Off"}
                        </button>
                    </div>

                    <button
                        onClick={handleJoin}
                        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {meetingIdInput ? "Join Meeting" : "Create Meeting"}
                    </button>
                </div>
            </div>
        </div>
    );
}
