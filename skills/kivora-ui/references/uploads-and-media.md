# Upload and playback sessions

Sources: `packages/nextjs/README.md`, `docs/file-upload-dashboard.md`, and `docs/web-player.md` in the module repository. Read the installed README/types and the corresponding website page before configuring advanced services.

## FileUpload

Keep `UploadController` stable for the lifetime of the upload session. Put it above route transitions if transfers must survive navigation. Dispose it when the session ends, not merely when a picker modal closes. `await controller.dispose()` cancels transfers and releases both engines.

| Mode | Transport and state | Feedback |
| --- | --- | --- |
| Simple | Tus by default; custom `createTask` transport supported. Automatic start by default. | Mount `Toaster`. A shared `FileUploadStatus` can accompany picker views with `showStatus={false}`. |
| Advanced | Tus only; owns a separate Uppy file state, not `controller.getSnapshot()`. Always queues for review, regardless of `autoStart`. | Progress and errors stay in the modal; no upload toasts. User explicitly chooses Upload. |

Advanced dashboard configuration is captured at first creation. Keep dashboard options stable; a new account/backend configuration requires a new controller/session. Closing releases capture devices but preserves transfers/results while the same controller is retained. Removing completed items clears the local list, not server files. Browser-restart recovery is not provided.

Device capture requires browser support, HTTPS/localhost and permissions. Remote sources require an application-deployed Companion service and provider configuration. OAuth secrets and signing keys belong on the server. A sample `/api/uploads` is not a Tus server.

`locale="en"`/`"es"` translate the built-in shell/dashboard. `messages` overrides the Kivora dictionary; another Uppy language also needs `dashboard.uppyLocale`. Custom source labels and backend errors remain application content.

Maintained page: https://www.kivora.pro/docs-markdown/componentes/file-upload.md.

## Player

Keep `PlayerSource` objects stable: changing object identity deliberately reloads playback. Define static sources outside the component or memoize derived sources. Keep a supplied controller stable too. Shaka loads after browser mount; constructing a controller does not itself begin network playback.

Playback requires supported codecs, CORS for media/segments/captions/licenses, and any needed DRM services. Player does not transcode media. Application-owned object URLs must be revoked after disconnecting or replacing their source.

`queue`, `activeQueueId`, and `onQueueSelect` describe application-controlled navigation. Selecting an episode does not automatically provide a catalogue or change the source; the application handles it. Changing `controlsVariant` preserves playback.

For persistent audio, mount `AudioPlayerProvider` in a shared layout and call `useAudioPlayer().play(source)`. Reserve space for its fixed footer. Avoid remounting the provider during navigation.

Offline HLS/DASH VOD uses browser storage. DRM offline requires persistent-license support and server authorization. Downloads do not reliably continue after closing the browser. `downloadUrl` exports clear progressive files; it is not a decrypted DRM export.

Only configure ads, DRM, remote sources, or analytics when required by the task. Verify those integrations against the actual deployment and report unavailable services.

Maintained page: https://www.kivora.pro/docs-markdown/componentes/player.md.
