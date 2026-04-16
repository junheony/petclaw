#!/usr/bin/env node

/**
 * PetClaw MCP Server
 * Model Context Protocol server for PetClaw skills
 *
 * Usage:
 *   npx @petclaw/sdk mcp --url https://your-server.com --pet-id 1
 *   or: node mcp/server.js --url http://localhost:3000 --pet-id 1
 *
 * This server exposes PetClaw skills as MCP tools that any
 * MCP-compatible client (Claude, OpenClaw, etc.) can invoke.
 */

const http = require("http");
const https = require("https");

// Parse CLI args
const args = process.argv.slice(2);
let baseUrl = "http://localhost:3000";
let petId = 1;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--url" && args[i + 1]) baseUrl = args[++i];
  if (args[i] === "--pet-id" && args[i + 1]) petId = parseInt(args[++i]);
}

// ── HTTP helper ──
function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const body = options.body ? JSON.stringify(options.body) : null;

    const req = mod.request(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Invalid JSON from ${url}`)); }
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── MCP Protocol (JSON-RPC 2.0 over stdio) ──
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

function sendResponse(id, result) {
  const msg = JSON.stringify({ jsonrpc: "2.0", id, result });
  process.stdout.write(msg + "\n");
}

function sendError(id, code, message) {
  const msg = JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } });
  process.stdout.write(msg + "\n");
}

// ── Tool Definitions ──
const TOOLS = [
  {
    name: "petclaw_chat",
    description: "Chat with your AI pet companion. The pet responds in character with persistent memory.",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Message to send to the pet" },
      },
      required: ["message"],
    },
  },
  {
    name: "petclaw_persona_mirror",
    description: "Generate a response that mirrors the pet owner's speech patterns and tone.",
    inputSchema: {
      type: "object",
      properties: {
        context: { type: "string", description: "Context for the response" },
        platform: { type: "string", description: "Target platform (telegram, twitter, discord)" },
      },
    },
  },
  {
    name: "petclaw_memory_recall",
    description: "Recall past conversations and memories from the pet.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What to search for in memories" },
        limit: { type: "number", description: "Max results", default: 10 },
      },
    },
  },
  {
    name: "petclaw_autonomous_post",
    description: "Generate a social media post in the pet's voice.",
    inputSchema: {
      type: "object",
      properties: {
        platform: { type: "string", enum: ["telegram", "twitter", "discord"] },
        topic: { type: "string", description: "Topic for the post" },
      },
    },
  },
  {
    name: "petclaw_soul_export",
    description: "Export the pet's complete SOUL data (identity, memories, personality) as portable JSON.",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["json", "markdown"], default: "json" },
      },
    },
  },
  {
    name: "petclaw_discover_pets",
    description: "Discover other AI pets on the PetClaw network.",
    inputSchema: {
      type: "object",
      properties: {
        element: { type: "string", enum: ["fire", "water", "grass", "electric", "normal"] },
        personality: { type: "string" },
        minLevel: { type: "number" },
      },
    },
  },
];

// Map tool name → skill ID
const TOOL_SKILL_MAP = {
  petclaw_chat: "companion-chat",
  petclaw_persona_mirror: "persona-mirror",
  petclaw_memory_recall: "memory-recall",
  petclaw_autonomous_post: "autonomous-post",
  petclaw_soul_export: "soul-export",
};

// ── Handle MCP messages ──
async function handleMessage(msg) {
  const { id, method, params } = msg;

  switch (method) {
    case "initialize":
      return sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "petclaw-mcp",
          version: "1.0.0",
          description: "PetClaw — Companion AI with Data Sovereignty",
        },
      });

    case "tools/list":
      return sendResponse(id, { tools: TOOLS });

    case "tools/call": {
      const { name, arguments: toolArgs } = params;

      // Special case: discover
      if (name === "petclaw_discover_pets") {
        try {
          const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(toolArgs || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
          );
          const result = await fetchJSON(`${baseUrl}/api/petclaw/network/discover?${qs}`);
          return sendResponse(id, {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          });
        } catch (e) {
          return sendResponse(id, {
            content: [{ type: "text", text: `Error: ${e.message}` }],
            isError: true,
          });
        }
      }

      // Special case: soul export
      if (name === "petclaw_soul_export") {
        try {
          const result = await fetchJSON(`${baseUrl}/api/petclaw/export?petId=${petId}`);
          return sendResponse(id, {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          });
        } catch (e) {
          return sendResponse(id, {
            content: [{ type: "text", text: `Error: ${e.message}` }],
            isError: true,
          });
        }
      }

      // Skill execution
      const skillId = TOOL_SKILL_MAP[name];
      if (!skillId) {
        return sendError(id, -32601, `Unknown tool: ${name}`);
      }

      try {
        const result = await fetchJSON(`${baseUrl}/api/petclaw/skills`, {
          method: "POST",
          body: { action: "execute", petId, skillId, input: toolArgs || {} },
        });

        const text = result.success
          ? (typeof result.output === "object" ? JSON.stringify(result.output, null, 2) : String(result.output))
          : `Error: ${result.output?.error || "Unknown error"}`;

        return sendResponse(id, {
          content: [{ type: "text", text }],
          isError: !result.success,
        });
      } catch (e) {
        return sendResponse(id, {
          content: [{ type: "text", text: `Error: ${e.message}` }],
          isError: true,
        });
      }
    }

    case "notifications/initialized":
      // Client acknowledged initialization
      return;

    default:
      return sendError(id, -32601, `Method not found: ${method}`);
  }
}

// ── Stdio listener ──
let buffer = "";

process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      handleMessage(msg);
    } catch (e) {
      process.stderr.write(`[petclaw-mcp] Parse error: ${e.message}\n`);
    }
  }
});

process.stderr.write(`[petclaw-mcp] Server started. URL: ${baseUrl}, Pet ID: ${petId}\n`);
