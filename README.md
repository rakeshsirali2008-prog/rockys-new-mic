# Rocky's New Mic

Streams the phone's microphone to the PC's speakers over the phone's hotspot.

## Layout

- `phone/index.html`: phone page (connect, start streaming)
- `pc-server/server.js`: PC server (serves the page, plays the audio)
- `pc-server/package.json`: server dependencies

## Run

1. Turn on the phone's hotspot. Connect the PC to it.
2. On the PC:
   ```
   cd pc-server
   npm install
   npm start
   ```
3. The PC prints an address like `http://192.168.x.x:8080`.
4. Open that address in Chrome on the phone.
5. Tap **Connect to PC**, then **Start Streaming**.

## Notes

- `speaker` is a native module. On Windows it needs the build tools (`npm install --global windows-build-tools`, or Visual Studio Build Tools) if `npm install` fails.
- Chrome on Android only allows microphone access on `https://` or `localhost`. Over plain `http://192.168...` the mic may be blocked. Workaround for testing: in Chrome go to `chrome://flags/#unsafely-treat-insecure-origin-as-secure`, add `http://192.168.x.x:8080`, and relaunch Chrome.
- Latency depends on the hotspot. Expect a noticeable delay.
