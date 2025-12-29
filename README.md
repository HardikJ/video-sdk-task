# VideoSDK Room Switching & Media Relay Task

This React application demonstrates two advanced features of VideoSDK:
1.  **Seamless Room Switching**: Moving a participant from Room A to Room B without full reconnection.
2.  **Media Relay**: Broadcasting a participant's audio/video from Room A to Room B without leaving Room A.

## Features

-   **Join Screen**: Create or join a meeting room.
-   **Meeting Controls**: Toggle Mic/Webcam, Leave.
-   **Switch Room**: Seamlessly transition to another room ID.
-   **Media Relay**: Project your presence (A/V) to another room ID.
-   **Responsive UI**: Built with Tailwind CSS.

## Project Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Auth Token**:
    Open `src/API.js` and replace `<Auth_Token>` with your valid VideoSDK JWT Token.
    *Alternatively, you can paste the token directly in the UI when joining.*
    
3.  **Add Env File**:
    Create a .env file in the root directory of the project and Add the variable to the .env file:
    ```bash
    VITE_VIDEOSDK_TOKEN=<your_generated_auth_token_here>
    ```

4.  **Run the Application**:
    ```bash
    npm run dev
    ```

## How to Test

### 1. Normal Room Switching
1.  Open **Tab 1** and join a room (e.g., `ROOM-A`).
2.  Open **Tab 2** and join a different room (e.g., `ROOM-B`).
3.  In **Tab 1**, enter `ROOM-B` in the "Target Room ID" input at the top.
4.  Click **Switch To**.
5.  Observe Tab 1 leaving Room A and joining Room B (Tab 2 sees the user appear).

### 2. Media Relay
1.  Refresh both tabs.
2.  Join `ROOM-A` in **Tab 1**.
3.  Join `ROOM-B` in **Tab 2**.
4.  In **Tab 1**, enter `ROOM-B` in the "Target Room ID" input.
5.  Click **Relay Media**.
6.  Observe Tab 1 *staying* in Room A.
7.  Observe Tab 2 seeing the video feed from the user in Tab 1 (as if they are a participant).

## Implementation Details

### Room Switching (`switchTo`)
We use the `switchTo` method from `useMeeting`. This keeps the socket connection alive while changing the room context on the server side, resulting in a faster transition than a full disconnect/reconnect.

### Media Relay (`requestMediaRelay`)
We use `requestMediaRelay` to "pipe" the media streams to a destination meeting. This is useful for:
-   Webinars where a host speaks to multiple breakout rooms.
-   "PK Battles" or cross-stream collaborations.
-   Announcements across rooms.
