export const authToken = import.meta.env.VITE_VIDEOSDK_TOKEN || "";

export const createMeeting = async ({ token }) => {
    try {
        const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
            method: "POST",
            headers: {
                authorization: `${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        const data = await res.json();

        if (!res.ok) {
            const errorDetail = data.error || data.message || JSON.stringify(data);
            throw new Error(`Failed to create meeting: ${errorDetail}`);
        }

        const { roomId } = data;
        return roomId;
    } catch (error) {
        console.error("createMeeting error:", error);
        throw error;
    }
};

