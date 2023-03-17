import express, { RequestHandler } from "express";

export default function createApp(...deps: RequestHandler[]) {
  const app = express();

  app.use(deps);
  
  return app;
}