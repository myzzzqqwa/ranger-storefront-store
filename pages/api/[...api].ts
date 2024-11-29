import type { NextApiRequest, NextApiResponse } from "next/types";
import { createProxyMiddleware } from "http-proxy-middleware";

import { domainConf } from "@/config/domain.conf";

const { i18n, ip } = domainConf;

const apiProxy: any = createProxyMiddleware({
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    "^/api": "",
  },
  router: async (req: any) => {
    const ipAddress =
      req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || // Check for forwarded IP
      req.headers?.["x-real-ip"] || // Alternate forwarded IP header
      "127.0.0.1"; // Default for localhost or unknown

    const locale = req.headers?.["x-locale-code"];
    return `${ip.apiUrl}?apiKey=${ip.apiKey}&ip=${ipAddress}&lang=${locale}`;
  },
} as any);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const locale = req.headers?.["x-locale-code"] as string;

  if (!i18n.locales.includes(locale)) {
    res.status(400).json({ error: "Unsupported locale" });
    return;
  }

  apiProxy(req, res, (result: unknown) => {
    if (result instanceof Error) {
      throw result;
    }

    throw new Error(
      `Request '${req.url}' is not proxied! We should never reach here!`
    );
  });
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default handler;
