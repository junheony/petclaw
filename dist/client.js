"use strict";
/**
 * PetClaw Client — Connect to any PetClaw-compatible server
 *
 * Usage:
 *   const client = new PetClawClient({ baseUrl: "https://myaipet.com" });
 *   const manifest = await client.manifest();
 *   const skills = await client.skills.list();
 *   const result = await client.skills.execute(1, "companion-chat", { message: "hi" });
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetClawClient = void 0;
class PetClawClient {
    constructor(config) {
        // ── Skills ──
        this.skills = {
            list: (query, category) => {
                const params = new URLSearchParams();
                if (query)
                    params.set("q", query);
                if (category)
                    params.set("category", category);
                return this.request(`/api/petclaw/skills?${params}`);
            },
            get: (skillId) => this.request(`/api/petclaw/skills?id=${skillId}`),
            getSkillMd: async (skillId) => {
                const res = await fetch(`${this.baseUrl}/api/petclaw/skills?id=${skillId}&format=md`);
                return res.text();
            },
            installed: (petId) => this.request(`/api/petclaw/skills?petId=${petId}`),
            install: (petId, skillId, config) => this.request("/api/petclaw/skills", {
                method: "POST",
                body: JSON.stringify({ action: "install", petId, skillId, config }),
            }),
            uninstall: (petId, skillId) => this.request("/api/petclaw/skills", {
                method: "POST",
                body: JSON.stringify({ action: "uninstall", petId, skillId }),
            }),
            execute: (petId, skillId, input) => this.request("/api/petclaw/skills", {
                method: "POST",
                body: JSON.stringify({ action: "execute", petId, skillId, input }),
            }),
        };
        // ── Data Sovereignty ──
        this.sovereignty = {
            export: (petId) => this.request(`/api/petclaw/export?petId=${petId}`),
            import: (soulData) => this.request("/api/petclaw/import", {
                method: "POST",
                body: JSON.stringify(soulData),
            }),
            delete: (petId) => this.request(`/api/petclaw/delete?petId=${petId}`, { method: "DELETE" }),
            verify: (petId, walletAddress) => this.request("/api/petclaw/verify", {
                method: "POST",
                body: JSON.stringify({ petId, walletAddress }),
            }),
        };
        // ── Network (Pet-to-Pet) ──
        this.network = {
            discover: (filters) => {
                const params = new URLSearchParams(Object.fromEntries(Object.entries(filters || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])));
                return this.request(`/api/petclaw/network/discover?${params}`);
            },
            invoke: (callerPetId, providerPetId, skillId, input) => this.request("/api/petclaw/network/invoke", {
                method: "POST",
                body: JSON.stringify({ callerPetId, providerPetId, skillId, input }),
            }),
        };
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.authToken = config.authToken;
    }
    async request(path, options = {}) {
        const headers = {
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
    async manifest() {
        return this.request("/api/petclaw");
    }
    // ── Pet Card (Discovery) ──
    async petCard() {
        return this.request("/.well-known/pet-card.json");
    }
}
exports.PetClawClient = PetClawClient;
