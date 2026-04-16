/**
 * PetClaw Protocol v1 — Types and Utilities
 * Standalone module — no server dependencies
 */
export declare const PETCLAW_PROTOCOL: "petclaw-v1";
export declare const PETCLAW_VERSION = "1.0.0";
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
    skills: {
        key: string;
        level: number;
        slot?: number;
    }[];
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
export declare function buildPetDID(ownerWallet: string, petId: number): string;
export declare function computeIntegrityHash(data: Omit<SoulExport, "integrityHash">): string;
export declare function verifySoulExport(soulData: SoulExport): boolean;
export declare const DEFAULT_SKILLS: PetClawSkill[];
export declare function buildManifest(baseUrl?: string): PetClawManifest;
