const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');

const createServiceProxy = (serviceName) => {
  const serviceUrl = config.services[serviceName];
  if (!serviceUrl) {
    throw new Error(`Service URL not found for ${serviceName}`);
  }

  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${serviceName}`]: '',
    },
    onError: (err, req, res) => {
      console.error(`Error proxying to ${serviceName}:`, err);
      res.status(500).json({
        success: false,
        message: `Error connecting to ${serviceName} service`,
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('x-forwarded-for', req.ip);
    },
  });
};

module.exports = {
  createServiceProxy,
}; 