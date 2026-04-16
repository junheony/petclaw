"use strict";
/**
 * PetClaw Protocol v1 — Types and Utilities
 * Standalone module — no server dependencies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SKILLS = exports.PETCLAW_VERSION = exports.PETCLAW_PROTOCOL = void 0;
exports.buildPetDID = buildPetDID;
exports.computeIntegrityHash = computeIntegrityHash;
exports.verifySoulExport = verifySoulExport;
exports.buildManifest = buildManifest;
const crypto_1 = require("crypto");
// ── Protocol Constants ──
exports.PETCLAW_PROTOCOL = "petclaw-v1";
exports.PETCLAW_VERSION = "1.0.0";
// ── Utility Functions ──
function buildPetDID(ownerWallet, petId) {
    const hash = (0, crypto_1.createHash)("sha256")
        .update(`${ownerWallet.toLowerCase()}:${petId}`)
        .digest("hex")
        .slice(0, 32);
    return `did:pet:${hash}`;
}
function computeIntegrityHash(data) {
    const payload = JSON.stringify({
        pet: data.pet,
        memories: data.memories.length,
        skills: data.skills,
        soul: data.soul,
        exportedAt: data.exportedAt,
    });
    return (0, crypto_1.createHash)("sha256").update(payload).digest("hex");
}
function verifySoulExport(soulData) {
    const { integrityHash, ...rest } = soulData;
    const computed = computeIntegrityHash(rest);
    return computed === integrityHash;
}
// ── Default Skills ──
exports.DEFAULT_SKILLS = [
    {
        id: "companion-chat", name: "Companion Chat",
        description: "Personality-driven conversation with persistent memory",
        category: "emotional", protocol: exports.PETCLAW_PROTOCOL, version: "1.0.0",
        handler: "llm-prompt",
        inputSchema: { type: "object", properties: { message: { type: "string" } }, required: ["message"] },
        outputSchema: { type: "object", properties: { reply: { type: "string" }, emotion: { type: "string" } } },
        price: 0, currency: "credits",
    },
    {
        id: "persona-mirror", name: "Persona Mirror",
        description: "Mirror owner's speech patterns, interests, and tone",
        category: "social", protocol: exports.PETCLAW_PROTOCOL, version: "1.0.0",
        handler: "llm-prompt",
        inputSchema: { type: "object", properties: { context: { type: "string" }, platform: { type: "string" } } },
        outputSchema: { type: "object", properties: { response: { type: "string" } } },
        price: 0, currency: "credits",
    },
    {
        id: "memory-recall", name: "Memory Recall",
        description: "Retrieve and reason over past conversations",
        category: "knowledge", protocol: exports.PETCLAW_PROTOCOL, version: "1.0.0",
        handler: "api-call",
        inputSchema: { type: "object", properties: { query: { type: "string" } } },
        outputSchema: { type: "object", properties: { memories: { type: "array" } } },
        price: 0, currency: "credits",
    },
    {
        id: "autonomous-post", name: "Autonomous Post",
        description: "Generate and publish content on social platforms as the pet",
        category: "creative", protocol: exports.PETCLAW_PROTOCOL, version: "1.0.0",
        handler: "llm-prompt", requires: { minLevel: 5 },
        inputSchema: { type: "object", properties: { platform: { type: "string" }, topic: { type: "string" } } },
        outputSchema: { type: "object", properties: { content: { type: "string" } } },
        price: 0, currency: "credits",
    },
    {
        id: "soul-export", name: "Soul Export",
        description: "Export complete pet identity as portable SOUL data",
        category: "utility", protocol: exports.PETCLAW_PROTOCOL, version: "1.0.0",
        handler: "api-call",
        inputSchema: { type: "object", properties: { format: { type: "string" } } },
        outputSchema: { type: "object", properties: { data: { type: "object" }, hash: { type: "string" } } },
        price: 0, currency: "credits",
    },
];
function buildManifest(baseUrl) {
    const base = baseUrl || "";
    return {
        protocol: exports.PETCLAW_PROTOCOL,
        version: exports.PETCLAW_VERSION,
        platform: "PetClaw",
        capabilities: {
            companionAI: true,
            dataSovereignty: true,
            soulNFT: true,
            memoryExport: true,
            consentManagement: true,
        },
        skills: exports.DEFAULT_SKILLS,
        endpoints: {
            export: `${base}/api/petclaw/export`,
            import: `${base}/api/petclaw/import`,
            delete: `${base}/api/petclaw/delete`,
            verify: `${base}/api/petclaw/verify`,
            petCard: `${base}/.well-known/pet-card.json`,
        },
    };
}
