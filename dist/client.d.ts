/**
 * PetClaw Client — Connect to any PetClaw-compatible server
 *
 * Usage:
 *   const client = new PetClawClient({ baseUrl: "https://myaipet.com" });
 *   const manifest = await client.manifest();
 *   const skills = await client.skills.list();
 *   const result = await client.skills.execute(1, "companion-chat", { message: "hi" });
 */
import type { PetClawManifest, PetClawSkill, SoulExport } from "./protocol";
export interface PetClawClientConfig {
    baseUrl: string;
    authToken?: string;
}
export declare class PetClawClient {
    private baseUrl;
    private authToken?;
    constructor(config: PetClawClientConfig);
    private request;
    manifest(): Promise<{
        manifest: PetClawManifest;
        stats: any;
    }>;
    petCard(): Promise<any>;
    skills: {
        list: (query?: string, category?: string) => Promise<{
            total: number;
            skills: PetClawSkill[];
        }>;
        get: (skillId: string) => Promise<{
            skill: PetClawSkill;
        }>;
        getSkillMd: (skillId: string) => Promise<string>;
        installed: (petId: number) => Promise<{
            installed: any[];
        }>;
        install: (petId: number, skillId: string, config?: Record<string, string>) => Promise<any>;
        uninstall: (petId: number, skillId: string) => Promise<any>;
        execute: (petId: number, skillId: string, input?: Record<string, unknown>) => Promise<any>;
    };
    sovereignty: {
        export: (petId: number) => Promise<SoulExport>;
        import: (soulData: SoulExport) => Promise<{
            petId: number;
        }>;
        delete: (petId: number) => Promise<{
            deletionHash: string;
            deletedAt: string;
        }>;
        verify: (petId: number, walletAddress: string) => Promise<{
            verified: boolean;
            petDID: string;
        }>;
    };
    network: {
        discover: (filters?: Record<string, any>) => Promise<{
            nodes: any[];
            network: any;
        }>;
        invoke: (callerPetId: number, providerPetId: number, skillId: string, input?: Record<string, unknown>) => Promise<any>;
    };
}
