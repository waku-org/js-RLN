import * as rln from "./index";

describe("js-rln", () => {
  it("should verify a proof", async function () {
    const rlnInstance = await rln.create();

    const memKeys = rlnInstance.generateMembershipKey();

    //peer's index in the Merkle Tree
    const index = 5;

    // Create a Merkle tree with random members
    for (let i = 0; i < 10; i++) {
      if (i == index) {
        // insert the current peer's pk
        rlnInstance.insertMember(memKeys.IDCommitment);
      } else {
        // create a new key pair
        rlnInstance.insertMember(
          rlnInstance.generateMembershipKey().IDCommitment
        );
      }
    }

    // prepare the message
    const uint8Msg = Uint8Array.from(
      "Hello World".split("").map((x) => x.charCodeAt(0))
    );

    // setting up the epoch
    const epoch = new Date();

    // generating proof
    const proof = await rlnInstance.generateRLNProof(
      uint8Msg,
      index,
      epoch,
      memKeys.IDKey
    );

    try {
      // verify the proof
      const verifResult = rlnInstance.verifyRLNProof(proof, uint8Msg);
      expect(verifResult).toBe(true);
    } catch (err) {
      throw Error("should not have failed proof verification");
    }

    try {
      // Modifying the signal so it's invalid
      uint8Msg[4] = 4;
      // verify the proof
      const verifResult = rlnInstance.verifyRLNProof(proof, uint8Msg);
      expect(verifResult).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });
  it("should verify a proof with a seeded membership key generation", async function () {
    const rlnInstance = await rln.create();
    const seed = "This is a test seed";
    const memKeys = rlnInstance.generateSeededMembershipKey(seed);

    //peer's index in the Merkle Tree
    const index = 5;

    // Create a Merkle tree with random members
    for (let i = 0; i < 10; i++) {
      if (i == index) {
        // insert the current peer's pk
        rlnInstance.insertMember(memKeys.IDCommitment);
      } else {
        // create a new key pair
        rlnInstance.insertMember(
          rlnInstance.generateMembershipKey().IDCommitment
        );
      }
    }

    // prepare the message
    const uint8Msg = Uint8Array.from(
      "Hello World".split("").map((x) => x.charCodeAt(0))
    );

    // setting up the epoch
    const epoch = new Date();

    // generating proof
    const proof = await rlnInstance.generateRLNProof(
      uint8Msg,
      index,
      epoch,
      memKeys.IDKey
    );

    try {
      // verify the proof
      const verifResult = rlnInstance.verifyRLNProof(proof, uint8Msg);
      expect(verifResult).toBe(true);
    } catch (err) {
      throw Error("should not have failed proof verification");
    }

    try {
      // Modifying the signal so it's invalid
      uint8Msg[4] = 4;
      // verify the proof
      const verifResult = rlnInstance.verifyRLNProof(proof, uint8Msg);
      expect(verifResult).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });
  it("should generate the same membership key if the same seed is provided", async function () {
    const rlnInstance = await rln.create();
    const seed = "This is a test seed";
    const memKeys1 = rlnInstance.generateSeededMembershipKey(seed);
    const memKeys2 = rlnInstance.generateSeededMembershipKey(seed);

    memKeys1.IDCommitment.forEach((element, index) => {
      expect(element).toBe(memKeys2.IDCommitment[index]);
    });
    memKeys1.IDKey.forEach((element, index) => {
      expect(element).toBe(memKeys2.IDKey[index]);
    });
  });
});
