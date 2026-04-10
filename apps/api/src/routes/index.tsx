import { createFileRoute } from "@tanstack/react-router";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () => {
        return json({
          message: "welcome to root",
        });
      },
    },
  },
});
