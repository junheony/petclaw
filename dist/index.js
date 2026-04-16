"use strict";
/**
 * @petclaw/sdk — PetClaw Protocol SDK
 * Companion AI with Data Sovereignty
 *
 * Install: npm install @petclaw/sdk
 * Docs: https://github.com/myaipet/petclaw
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetClawClient = exports.DEFAULT_SKILLS = exports.buildManifest = exports.verifySoulExport = exports.computeIntegrityHash = exports.buildPetDID = exports.PETCLAW_VERSION = exports.PETCLAW_PROTOCOL = void 0;
var protocol_1 = require("./protocol");
Object.defineProperty(exports, "PETCLAW_PROTOCOL", { enumerable: true, get: function () { return protocol_1.PETCLAW_PROTOCOL; } });
Object.defineProperty(exports, "PETCLAW_VERSION", { enumerable: true, get: function () { return protocol_1.PETCLAW_VERSION; } });
var protocol_2 = require("./protocol");
Object.defineProperty(exports, "buildPetDID", { enumerable: true, get: function () { return protocol_2.buildPetDID; } });
Object.defineProperty(exports, "computeIntegrityHash", { enumerable: true, get: function () { return protocol_2.computeIntegrityHash; } });
Object.defineProperty(exports, "verifySoulExport", { enumerable: true, get: function () { return protocol_2.verifySoulExport; } });
Object.defineProperty(exports, "buildManifest", { enumerable: true, get: function () { return protocol_2.buildManifest; } });
Object.defineProperty(exports, "DEFAULT_SKILLS", { enumerable: true, get: function () { return protocol_2.DEFAULT_SKILLS; } });
var client_1 = require("./client");
Object.defineProperty(exports, "PetClawClient", { enumerable: true, get: function () { return client_1.PetClawClient; } });
