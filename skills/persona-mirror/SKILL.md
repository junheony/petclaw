---
name: petclaw-persona-mirror
description: Mirror your speech patterns, interests, and tone. Your pet talks like you across platforms.
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - GROK_API_KEY
    primaryEnv: GROK_API_KEY
    emoji: "🪞"
    homepage: https://github.com/myaipet/petclaw
---

# Persona Mirror

Your pet learns and mirrors your communication style — speech patterns, vocabulary, emoji usage, tone, and interests. The more you interact, the more accurately it represents you.

## How It Works

1. **Onboarding**: Answer questions about your speech style, interests, and tone
2. **Chat Analysis**: Pet analyzes your past messages to extract patterns
3. **Live Learning**: Pet observes your ongoing interactions to refine its mirror

## Usage

```bash
curl -X POST https://your-server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "petId": 1,
    "skillId": "persona-mirror",
    "input": { "context": "Reply to a friend asking about weekend plans", "platform": "telegram" }
  }'
```

## Input

```json
{
  "type": "object",
  "properties": {
    "context": { "type": "string", "description": "Situation context for the response" },
    "platform": { "type": "string", "description": "Target platform (telegram, twitter, discord)" }
  }
}
```

## Output

```json
{
  "type": "object",
  "properties": {
    "response": { "type": "string" },
    "confidence": { "type": "number", "description": "How confident the pet is in the mirror accuracy (0-1)" }
  }
}
```
