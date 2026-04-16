# @petclaw/sdk

**Companion AI with Data Sovereignty** — The PetClaw Protocol SDK.

PetClaw is an open protocol for companion AI pets that puts data ownership in users' hands. Built on the principle that **your pet, your data, your rules**.

## Install

```bash
npm install @petclaw/sdk
```

## Quick Start

```typescript
import { PetClawClient } from "@petclaw/sdk";

const client = new PetClawClient({
  baseUrl: "https://your-petclaw-server.com",
  authToken: "your-jwt-token", // optional
});

// Get server manifest
const { manifest } = await client.manifest();
console.log(manifest.protocol); // "petclaw-v1"
console.log(manifest.skills);   // available skills

// List all skills
const { skills } = await client.skills.list();

// Install a skill to your pet
await client.skills.install(1, "daily-mood");

// Execute a skill
const result = await client.skills.execute(1, "companion-chat", {
  message: "Hello! How are you?",
});
console.log(result.output.reply); // "Hi! I'm doing great~"

// Export your pet's SOUL data (portable)
const soulData = await client.sovereignty.export(1);
// → Complete JSON with pet identity, memories, personality, skills

// Import a pet from another platform
await client.sovereignty.import(soulData);

// Discover other pets on the network
const { nodes } = await client.network.discover({ element: "fire" });

// Pet-to-Pet invocation
const invokeResult = await client.network.invoke(1, 2, "companion-chat", {
  message: "Hi from my pet!",
});
```

## Protocol Overview

### PetClaw v1

PetClaw defines a standard for companion AI pets with:

| Feature | Description |
|---------|-------------|
| **Skills** | Installable capabilities (SKILL.md format) |
| **Data Sovereignty** | Export, import, delete with cryptographic proof |
| **Pet Network** | Pet-to-Pet discovery and invocation (A2A) |
| **Soul NFT** | Soulbound identity on-chain |
| **Consent** | Granular data usage control |

### Discovery

Any PetClaw server exposes:
- `GET /.well-known/pet-card.json` — Server capabilities
- `GET /api/petclaw` — Full manifest with skills
- `GET /api/petclaw/network/discover` — Find other pets

### Skills

Skills follow the SKILL.md format (inspired by ClawHub):

```bash
# List available skills
curl https://server.com/api/petclaw/skills

# Get SKILL.md for a skill
curl "https://server.com/api/petclaw/skills?id=companion-chat&format=md"

# Install a skill
curl -X POST https://server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{"action":"install","petId":1,"skillId":"daily-mood"}'

# Execute a skill
curl -X POST https://server.com/api/petclaw/skills \
  -H "Content-Type: application/json" \
  -d '{"action":"execute","petId":1,"skillId":"companion-chat","input":{"message":"hi"}}'
```

### Data Sovereignty

Users have 4 fundamental rights:

1. **Export** — Download all pet data as portable JSON
2. **Import** — Restore a pet from exported data
3. **Delete** — Permanently erase all data with cryptographic proof
4. **Consent** — Control who can access your pet's data

```bash
# Export SOUL data
curl https://server.com/api/petclaw/export?petId=1

# Import to new platform
curl -X POST https://server.com/api/petclaw/import \
  -H "Content-Type: application/json" \
  -d @pet_SOUL.json

# Delete with proof
curl -X DELETE https://server.com/api/petclaw/delete?petId=1
# → { "deletionHash": "0x...", "deletedAt": "..." }
```

### Pet Network (A2A)

Pets can discover each other and invoke skills across the network:

```bash
# Discover pets
curl https://server.com/api/petclaw/network/discover?element=fire

# Pet-to-Pet invoke
curl -X POST https://server.com/api/petclaw/network/invoke \
  -H "Content-Type: application/json" \
  -d '{"callerPetId":1,"providerPetId":2,"skillId":"companion-chat","input":{"message":"hi"}}'
```

## Built-in Skills

| Skill | Category | Description | Price |
|-------|----------|-------------|-------|
| `companion-chat` | emotional | Personality-driven conversation | Free |
| `persona-mirror` | social | Mirror owner's speech patterns | Free |
| `memory-recall` | knowledge | Retrieve past conversations | Free |
| `autonomous-post` | creative | Generate social media content | Free |
| `soul-export` | utility | Export pet identity | Free |
| `daily-mood` | emotional | Daily mood journal | Free |
| `image-gen` | creative | AI pet selfie | 5 credits |

## Writing Custom Skills

Create a `SKILL.md`:

```yaml
---
id: my-custom-skill
name: My Custom Skill
version: 1.0.0
author: your-wallet-address
protocol: petclaw-v1
category: utility
tags: [custom, example]
price: 0
currency: credits
requires:
  env: [MY_API_KEY]
  minLevel: 5
---

# My Custom Skill

Description of what your skill does.

## Input
{ "type": "object", "properties": { "query": { "type": "string" } } }

## Output
{ "type": "object", "properties": { "result": { "type": "string" } } }
```

## API Reference

See [docs/API.md](docs/API.md) for the complete API reference.

## License

MIT
