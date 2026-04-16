/**
 * @petclaw/sdk — PetClaw Protocol SDK
 * Companion AI with Data Sovereignty
 *
 * Install: npm install @petclaw/sdk
 * Docs: https://github.com/myaipet/petclaw
 */

export { PETCLAW_PROTOCOL, PETCLAW_VERSION } from "./protocol";
export type {
  PetClawManifest,
  PetClawSkill,
  PetIdentity,
  ConsentSettings,
  SoulExport,
} from "./protocol";
export {
  buildPetDID,
  computeIntegrityHash,
  verifySoulExport,
  buildManifest,
  DEFAULT_SKILLS,
} from "./protocol";

export { PetClawClient } from "./client";
export type { PetClawClientConfig } from "./client";
