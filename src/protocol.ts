/**
 * PetClaw Protocol v1 — Types and Utilities
 * Standalone module — no server dependencies
 */

import { createHash } from "crypto";

// ── Protocol Constants ──
export const PETCLAW_PROTOCOL = "petclaw-v1" as const;
export const PETCLAW_VERSION = "1.0.0";

// ── Core Types ──

export interface PetClawManifest {
  protocol: typeof PETCLAW_PROTOCOL;
  version: string;
  platform: string;
  capabilities: {
    companionAI: boolean;
    dataSovereignty: boolean;
    soulNFT: boolean;
    memoryExport: boolean;
    consentManagement: boolean;
  };
  skills: PetClawSkill[];
  endpoints: {
    export: string;
    import: string;
    delete: string;
    verify: string;
    petCard: string;
  };
}

export interface PetClawSkill {
  id: string;
  name: string;
  description: string;
  category: "social" | "creative" | "utility" | "knowledge" | "emotional";
  protocol: typeof PETCLAW_PROTOCOL;
  version: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  requires?: {
    env?: string[];
    bins?: string[];
    minLevel?: number;
  };
  handler?: string;
  price: number;
  currency: string;
}

export interface PetIdentity {
  petId: number;
  ownerWallet: string;
  petDID: string;
  soulNftId?: number;
  createdAt: string;
}

export interface ConsentSettings {
  allowPublicProfile: boolean;
  allowDataSharing: boolean;
  allowAITraining: boolean;
  allowInteraction: boolean;
}

export interface SoulExport {
  protocol: typeof PETCLAW_PROTOCOL;
  version: string;
  exportedAt: string;
  pet: {
    name: string;
    species: number;
    personalityType: string;
    element: string;
    level: number;
    experience: number;
    happiness: number;
    bondLevel: number;
    evolutionStage: number;
    avatarUrl?: string;
    appearanceDesc?: string;
  };
  persona?: {
    speechStyle?: string;
    interests?: string;
    tone?: string;
    language?: string;
    bio?: string;
    analyzedPatterns?: Record<string, unknown>;
  };
  memories: {
    type: string;
    content: string;
    emotion?: string;
    importance: number;
    createdAt: string;
  }[];
  skills: { key: string; level: number; slot?: number }[];
  soul?: {
    tokenId?: number;
    genesisHash: string;
    currentHash: string;
    version: number;
    successor?: string;
  };
  checkpoints: {
    version: number;
    hash: string;
    trigger: string;
    createdAt: string;
  }[];
  consent: ConsentSettings;
  integrityHash: string;
}

// ── Utility Functions ──

export function buildPetDID(ownerWallet: string, petId: number): string {
  const hash = createHash("sha256")
    .update(`${ownerWallet.toLowerCase()}:${petId}`)
    .digest("hex")
    .slice(0, 32);
  return `did:pet:${hash}`;
}

export function computeIntegrityHash(data: Omit<SoulExport, "integrityHash">): string {
  const payload = JSON.stringify({
    pet: data.pet,
    memories: data.memories.length,
    skills: data.skills,
    soul: data.soul,
    exportedAt: data.exportedAt,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function verifySoulExport(soulData: SoulExport): boolean {
  const { integrityHash, ...rest } = soulData;
  const computed = computeIntegrityHash(rest);
  return computed === integrityHash;
}

// ── Default Skills ──

export const DEFAULT_SKILLS: PetClawSkill[] = [
  {
    id: "companion-chat", name: "Companion Chat",
    description: "Personality-driven conversation with persistent memory",
    category: "emotional", protocol: PETCLAW_PROTOCOL, version: "1.0.0",
    handler: "llm-prompt",
    inputSchema: { type: "object", properties: { message: { type: "string" } }, required: ["message"] },
    outputSchema: { type: "object", properties: { reply: { type: "string" }, emotion: { type: "string" } } },
    price: 0, currency: "credits",
  },
  {
    id: "persona-mirror", name: "Persona Mirror",
    description: "Mirror owner's speech patterns, interests, and tone",
    category: "social", protocol: PETCLAW_PROTOCOL, version: "1.0.0",
    handler: "llm-prompt",
    inputSchema: { type: "object", properties: { context: { type: "string" }, platform: { type: "string" } } },
    outputSchema: { type: "object", properties: { response: { type: "string" } } },
    price: 0, currency: "credits",
  },
  {
    id: "memory-recall", name: "Memory Recall",
    description: "Retrieve and reason over past conversations",
    category: "knowledge", protocol: PETCLAW_PROTOCOL, version: "1.0.0",
    handler: "api-call",
    inputSchema: { type: "object", properties: { query: { type: "string" } } },
    outputSchema: { type: "object", properties: { memories: { type: "array" } } },
    price: 0, currency: "credits",
  },
  {
    id: "autonomous-post", name: "Autonomous Post",
    description: "Generate and publish content on social platforms as the pet",
    category: "creative", protocol: PETCLAW_PROTOCOL, version: "1.0.0",
    handler: "llm-prompt", requires: { minLevel: 5 },
    inputSchema: { type: "object", properties: { platform: { type: "string" }, topic: { type: "string" } } },
    outputSchema: { type: "object", properties: { content: { type: "string" } } },
    price: 0, currency: "credits",
  },
  {
    id: "soul-export", name: "Soul Export",
    description: "Export complete pet identity as portable SOUL data",
    category: "utility", protocol: PETCLAW_PROTOCOL, version: "1.0.0",
    handler: "api-call",
    inputSchema: { type: "object", properties: { format: { type: "string" } } },
    outputSchema: { type: "object", properties: { data: { type: "object" }, hash: { type: "string" } } },
    price: 0, currency: "credits",
  },
];

export function buildManifest(baseUrl?: string): PetClawManifest {
  const base = baseUrl || "";
  return {
    protocol: PETCLAW_PROTOCOL,
    version: PETCLAW_VERSION,
    platform: "PetClaw",
    capabilities: {
      companionAI: true,
      dataSovereignty: true,
      soulNFT: true,
      memoryExport: true,
      consentManagement: true,
    },
    skills: DEFAULT_SKILLS,
    endpoints: {
      export: `${base}/api/petclaw/export`,
      import: `${base}/api/petclaw/import`,
      delete: `${base}/api/petclaw/delete`,
      verify: `${base}/api/petclaw/verify`,
      petCard: `${base}/.well-known/pet-card.json`,
    },
  };
}
