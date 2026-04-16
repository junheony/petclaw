---
name: petclaw-memory-recall
description: Retrieve and reason over past conversations and experiences. Your pet never forgets.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧠"
    homepage: https://github.com/myaipet/petclaw
---

# Memory Recall

Your pet retrieves relevant memories from past conversations and experiences, providing context-aware responses.

## Usage

```bash
curl -X POST https://your-server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "petId": 1,
    "skillId": "memory-recall",
    "input": { "query": "What did we talk about last week?" }
  }'
```

## Input

```json
{
  "type": "object",
  "properties": {
    "query": { "type": "string" },
    "limit": { "type": "number", "default": 10 }
  }
}
```

## Output

```json
{
  "type": "object",
  "properties": {
    "memories": { "type": "array" },
    "summary": { "type": "string" }
  }
}
```

## Data Sovereignty

All memories are owned by the pet owner. They can be exported, imported, or permanently deleted with cryptographic proof via the PetClaw sovereignty API.
