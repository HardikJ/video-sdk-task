import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

export function ParticipantView({ participantId }) {
    const webcamRef = useRef(null);
    const micRef = useRef(null);

    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
        useParticipant(participantId);

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (webcamRef.current && videoStream) {
            webcamRef.current.srcObject = videoStream;
            webcamRef.current.play().catch((error) => console.error("videoPlay", error));
        }
    }, [webcamRef, videoStream]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current.play().catch((error) => console.error("audioPlay", error));
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div className="relative w-full max-w-[600px] aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg group">
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />

            {webcamOn ? (
                <video
                    ref={webcamRef}
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror local video if preferred, standard for meetings
                    playsInline
                    muted={true} // React-SDK handles audio through audio tag, video should be muted
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-4xl font-bold text-gray-500 uppercase">
                        {displayName ? displayName[0] : "P"}
                    </div>
                </div>
            )}

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm z-10 flex items-center gap-2">
                <span className="font-medium text-white max-w-[150px] truncate">
                    {displayName} {isLocal && "(You)"}
                </span>
                <div className={`w-2 h-2 rounded-full ${micOn ? 'bg-emerald-500' : 'bg-red-500'}`} title={micOn ? "Mic On" : "Mic Off"}></div>
            </div>

            {/* Mic Status Indicator (optional visual cue in center when talking) */}
            {!micOn && (
                <div className="absolute top-4 right-4 bg-red-500/80 p-1.5 rounded-full backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" h="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </div>
            )}
        </div>
    );
}
