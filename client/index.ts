import { createSocket } from './web-socket';

async function main() {
  const socket = await createSocket();

  socket.emit('olá servidor');
}

main().catch(console.error);