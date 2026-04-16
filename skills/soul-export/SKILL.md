---
name: petclaw-soul-export
description: Export your pet's complete identity — personality, memories, skills — as portable SOUL data. Take your pet anywhere.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📦"
    homepage: https://github.com/myaipet/petclaw
---

# Soul Export

Export your pet's entire identity as a portable JSON file. This is the core of PetClaw's data sovereignty — your pet is never locked to one platform.

## What Gets Exported

- Pet identity (name, species, personality, level, stats)
- Persona (speech patterns, interests, tone, analyzed patterns)
- All memories (conversations, milestones, experiences)
- Learned skills and levels
- Soul NFT state (genesis hash, version, checkpoints)
- Consent settings
- Cryptographic integrity hash (tamper-proof)

## Usage

```bash
# Via API
curl https://your-server.com/api/petclaw/export?petId=1 -o my_pet_SOUL.json

# Via SDK
const soul = await client.sovereignty.export(1);
```

## Importing on Another Platform

```bash
curl -X POST https://another-server.com/api/petclaw/import \
  -H "Content-Type: application/json" \
  -d @my_pet_SOUL.json
```

The integrity hash ensures the data hasn't been tampered with during transfer.

## Data Sovereignty Rights

1. **Export** — You can always take your data
2. **Import** — Any PetClaw server can accept your pet
3. **Delete** — Permanent erasure with cryptographic proof
4. **Consent** — You control who accesses your pet's data
