import { RLNDecoder, RLNEncoder } from "./codec.js";
import { RLN_ABI, SEPOLIA_CONTRACT } from "./constants.js";
import {
  IdentityCredential,
  Proof,
  ProofMetadata,
  RLNInstance,
} from "./rln.js";
import { RLNContract } from "./rln_contract.js";
import { MerkleRootTracker } from "./root_tracker.js";

// reexport the create function, dynamically imported from rln.ts
export async function create(): Promise<RLNInstance> {
  // A dependency graph that contains any wasm must all be imported
  // asynchronously. This file does the single async import, so
  // that no one else needs to worry about it again.
  const rlnModule = await import("./rln.js");
  return await rlnModule.create();
}

export {
  RLNInstance,
  IdentityCredential,
  Proof,
  ProofMetadata,
  RLNEncoder,
  RLNDecoder,
  MerkleRootTracker,
  RLNContract,
  RLN_ABI,
  SEPOLIA_CONTRACT,
};
