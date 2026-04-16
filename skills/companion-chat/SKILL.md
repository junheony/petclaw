---
name: petclaw-companion-chat
description: Personality-driven AI companion conversation with persistent memory. Your pet remembers everything and responds in character.
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - GROK_API_KEY
    primaryEnv: GROK_API_KEY
    emoji: "💬"
    homepage: https://github.com/myaipet/petclaw
    os: [macos, linux]
---

# Companion Chat

Your AI pet engages in personality-driven conversation with persistent memory. Every interaction shapes who your pet becomes.

## How It Works

This skill uses LLM (Grok) to generate responses that match your pet's personality type. The pet remembers past conversations and maintains consistent character across all interactions.

### Personality Types

| Type | Behavior |
|------|----------|
| playful | Energetic, uses emojis, asks fun questions |
| brave | Confident, encouraging, uses action words |
| gentle | Calm, supportive, soft-spoken |
| shy | Hesitant, uses "um...", gradually opens up |
| lazy | Casual, short responses, sleepy references |
| curious | Asks questions back, explores topics |

## Usage

```bash
# Via PetClaw API
curl -X POST https://your-server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "petId": 1,
    "skillId": "companion-chat",
    "input": { "message": "How are you today?" }
  }'
```

```typescript
// Via SDK
import { PetClawClient } from "@petclaw/sdk";
const client = new PetClawClient({ baseUrl: "https://your-server.com" });
const result = await client.skills.execute(1, "companion-chat", {
  message: "How are you today?"
});
console.log(result.output.reply);
```

## Input

```json
{
  "type": "object",
  "properties": {
    "message": { "type": "string", "description": "User message to the pet" }
  },
  "required": ["message"]
}
```

## Output

```json
{
  "type": "object",
  "properties": {
    "reply": { "type": "string", "description": "Pet's response" },
    "model": { "type": "string", "description": "LLM model used" },
    "tokensUsed": { "type": "number" }
  }
}
```

## Data Sovereignty

All conversation data is owned by the pet owner. Memories can be exported via SOUL export and imported to any PetClaw-compatible platform.
