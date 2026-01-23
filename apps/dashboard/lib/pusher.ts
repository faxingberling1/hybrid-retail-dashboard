import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

export const pusherServer = globalThis.pusherServerInstance || new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.PUSHER_KEY!, {
  cluster: process.env.PUSHER_CLUSTER!,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.pusherServerInstance = pusherServer;
}