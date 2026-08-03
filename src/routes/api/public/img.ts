import { createFileRoute } from "@tanstack/react-router";

const ALLOWED = ["i.imgflip.com", "imgflip.com"];

export const Route = createFileRoute("/api/public/img")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const src = new URL(request.url).searchParams.get("url");
        if (!src) return new Response("Missing url", { status: 400 });

        let target: URL;
        try {
          target = new URL(src);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (target.protocol !== "https:" || !ALLOWED.includes(target.hostname)) {
          return new Response("Host not allowed", { status: 403 });
        }

        const upstream = await fetch(target.toString());
        if (!upstream.ok) {
          return new Response(`Upstream failed [${upstream.status}]`, {
            status: upstream.status,
          });
        }

        return new Response(upstream.body, {
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
