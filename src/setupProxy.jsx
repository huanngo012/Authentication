const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = (app) => {
  app.use(
    createProxyMiddleware("/auth/login", {
      target: "https://auth-server-fmp.vercel.app",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/test", {
      target: "https://auth-server-fmp.vercel.app",
      changeOrigin: true,
    })
  );
};
