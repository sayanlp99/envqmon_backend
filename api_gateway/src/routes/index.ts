import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

// Proxy /auth/* → http://localhost:3001/api/auth/*
router.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/api/auth",
    },
    logger: console,
  })
);

// Add other services here in the same pattern
// router.use(
//   "/devices",
//   createProxyMiddleware({
//     target: "http://localhost:3002",
//     changeOrigin: true,
//     pathRewrite: { "^/devices": "/api/devices" },
//   })
// );

export default router;
