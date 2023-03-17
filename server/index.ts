import express from "express";
import createApp from "./create-app";
import { createWebsocketHandler } from "./routes/websocket";

const STATIC_PAGES_ROOT = 'public';

const app = createApp(
  express.static(STATIC_PAGES_ROOT),
  createWebsocketHandler(),
);

app.listen(8080, 'localhost', () => {
  console.log(`listening http://localhost:8080/`)
});