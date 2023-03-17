import express, { Router } from "express";
import zod from 'zod';

export function createWebsocketHandler() {
  const router = Router();

  router.use(express.text());

  router.get('/socket', (req, res) => {
    res.write('data 1');

    setInterval(() => {
      res.write('data 2');

      res.end();
    }, 2000);
  });

  router.post('/socket', (req, res) => {
    req.on('data', (chunk: string) => {
      console.log(chunk);
    });

    req.on('end', () => {
      console.log('fim da requisição!');
      res.end();
    });
  });

  return router;
}