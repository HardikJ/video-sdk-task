import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

export function Controls() {
    const { toggleMic, toggleWebcam, leave, localMicOn, localWebcamOn } = useMeeting();

    return (
        <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <button
                onClick={() => toggleMic()}
                className={`p-3 rounded-full transition ${localMicOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                title="Toggle Microphone"
            >
                {localMicOn ? "Mic On" : "Mic Off"}
            </button>

            <button
                onClick={() => toggleWebcam()}
                className={`p-3 rounded-full transition ${localWebcamOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                title="Toggle Webcam"
            >
                {localWebcamOn ? "Cam On" : "Cam Off"}
            </button>

            <button
                onClick={() => leave()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
                Leave
            </button>
        </div>
    );
}
