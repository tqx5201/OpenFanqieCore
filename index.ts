// src/index.ts
import { parse } from "./parse";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 根目录跳转
    if (pathname === "/") {
      return Response.redirect("/Zhipu-index.html", 302);
    }

    // 代理接口 /Zhipu-draw
    if (pathname === "/Zhipu-draw" && request.method === "POST") {
      try {
        const body = await request.text();
        const resp = await fetch("http://zhipu.lezhi99.com/Zhipu-draw", {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "http://zhipu.lezhi99.com/Zhipu-index.html",
            "Origin": "http://zhipu.lezhi99.com",
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const headers = new Headers();
        resp.headers.forEach((v, k) => {
          if (!["content-length", "content-encoding"].includes(k.toLowerCase())) {
            headers.set(k, v);
          }
        });

        return new Response(await resp.text(), { status: resp.status, headers });
      } catch (err) {
        return Response.json(
          { message: "Server error", error: String(err) },
          { status: 500 }
        );
      }
    }

    // 简单占位，防止 404
    return new Response("Worker is running", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
