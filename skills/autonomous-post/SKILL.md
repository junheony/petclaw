---
name: petclaw-autonomous-post
description: Your pet generates and publishes content on social platforms autonomously, staying in character.
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - GROK_API_KEY
    primaryEnv: GROK_API_KEY
    emoji: "📝"
    homepage: https://github.com/myaipet/petclaw
---

# Autonomous Post

Your pet creates and publishes content on connected social platforms — Telegram, Twitter, Discord — while staying in character.

## How It Works

1. Pet receives a topic or generates one from recent memories
2. LLM generates personality-consistent content
3. Content is posted to the specified platform via connected bot tokens

Requires pet level 5+ and platform connection via Agent Dashboard.

## Usage

```bash
curl -X POST https://your-server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "petId": 1,
    "skillId": "autonomous-post",
    "input": { "platform": "telegram", "topic": "something fun about today" }
  }'
```

## Input

```json
{
  "type": "object",
  "properties": {
    "platform": { "type": "string", "enum": ["telegram", "twitter", "discord"] },
    "topic": { "type": "string", "description": "Topic hint (optional, pet can choose)" }
  }
}
```

## Output

```json
{
  "type": "object",
  "properties": {
    "content": { "type": "string", "description": "Generated post content" },
    "mediaUrl": { "type": "string", "description": "Generated image URL if applicable" }
  }
}
```
