/**
 * PetClaw Client — Connect to any PetClaw-compatible server
 *
 * Usage:
 *   const client = new PetClawClient({ baseUrl: "https://myaipet.com" });
 *   const manifest = await client.manifest();
 *   const skills = await client.skills.list();
 *   const result = await client.skills.execute(1, "companion-chat", { message: "hi" });
 */

import type { PetClawManifest, PetClawSkill, SoulExport, ConsentSettings } from "./protocol";

export interface PetClawClientConfig {
  baseUrl: string;
  authToken?: string;
}

export class PetClawClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(config: PetClawClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.authToken = config.authToken;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
    };

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // ── Manifest ──
  async manifest(): Promise<{ manifest: PetClawManifest; stats: any }> {
    return this.request("/api/petclaw");
  }

  // ── Pet Card (Discovery) ──
  async petCard(): Promise<any> {
    return this.request("/.well-known/pet-card.json");
  }

  // ── Skills ──
  skills = {
    list: (query?: string, category?: string): Promise<{ total: number; skills: PetClawSkill[] }> => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      return this.request(`/api/petclaw/skills?${params}`);
    },

    get: (skillId: string): Promise<{ skill: PetClawSkill }> =>
      this.request(`/api/petclaw/skills?id=${skillId}`),

    getSkillMd: async (skillId: string): Promise<string> => {
      const res = await fetch(`${this.baseUrl}/api/petclaw/skills?id=${skillId}&format=md`);
      return res.text();
    },

    installed: (petId: number): Promise<{ installed: any[] }> =>
      this.request(`/api/petclaw/skills?petId=${petId}`),

    install: (petId: number, skillId: string, config?: Record<string, string>): Promise<any> =>
      this.request("/api/petclaw/skills", {
        method: "POST",
        body: JSON.stringify({ action: "install", petId, skillId, config }),
      }),

    uninstall: (petId: number, skillId: string): Promise<any> =>
      this.request("/api/petclaw/skills", {
        method: "POST",
        body: JSON.stringify({ action: "uninstall", petId, skillId }),
      }),

    execute: (petId: number, skillId: string, input?: Record<string, unknown>): Promise<any> =>
      this.request("/api/petclaw/skills", {
        method: "POST",
        body: JSON.stringify({ action: "execute", petId, skillId, input }),
      }),
  };

  // ── Data Sovereignty ──
  sovereignty = {
    export: (petId: number): Promise<SoulExport> =>
      this.request(`/api/petclaw/export?petId=${petId}`),

    import: (soulData: SoulExport): Promise<{ petId: number }> =>
      this.request("/api/petclaw/import", {
        method: "POST",
        body: JSON.stringify(soulData),
      }),

    delete: (petId: number): Promise<{ deletionHash: string; deletedAt: string }> =>
      this.request(`/api/petclaw/delete?petId=${petId}`, { method: "DELETE" }),

    verify: (petId: number, walletAddress: string): Promise<{ verified: boolean; petDID: string }> =>
      this.request("/api/petclaw/verify", {
        method: "POST",
        body: JSON.stringify({ petId, walletAddress }),
      }),
  };

  // ── Network (Pet-to-Pet) ──
  network = {
    discover: (filters?: Record<string, any>): Promise<{ nodes: any[]; network: any }> => {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
      );
      return this.request(`/api/petclaw/network/discover?${params}`);
    },

    invoke: (callerPetId: number, providerPetId: number, skillId: string, input?: Record<string, unknown>): Promise<any> =>
      this.request("/api/petclaw/network/invoke", {
        method: "POST",
        body: JSON.stringify({ callerPetId, providerPetId, skillId, input }),
      }),
  };
}
