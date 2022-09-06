import * as rln from "@waku/rln";

rln.create().then(async rlnInstance => {
    let memKeys = rlnInstance.generateMembershipKey();

    //peer's index in the Merkle Tree
    const index = 5

    // Create a Merkle tree with random members
    for (let i = 0; i < 10; i++) {
        if (i == index) {
            // insert the current peer's pk
            rlnInstance.inserMember(memKeys.IDCommitment);
        } else {
            // create a new key pair
            let memKeys = rlnInstance.generateMembershipKey(); // TODO: handle error
            rlnInstance.inserMember(memKeys.IDCommitment);

        }
    }

    // prepare the message
    const uint8Msg = Uint8Array.from("Hello World".split("").map(x => x.charCodeAt()));

    // setting up the epoch (With 0s for the test)
    const epoch = new Uint8Array(32);

    console.log("Generating proof...");
    console.time("proof_gen_timer");
    let proof = await rlnInstance.generateProof(uint8Msg, index, epoch, memKeys.IDKey)
    console.timeEnd("proof_gen_timer");
    console.log("Proof", proof)

    try {
        // verify the proof
        let verifResult = rlnInstance.verifyProof(proof);
        console.log("Is proof verified?", verifResult ? "yes" : "no");
    } catch (err) {
        console.log("Invalid proof")
    }

    try {
        // Modifying the proof so it's invalid
        proof[7] = 7;
        // verify the proof
        let verifResult = rlnInstance.verifyProof(proof);
        console.log("Is proof verified?", verifResult ? "yes" : "no");
    } catch (err) {
        console.log("Invalid proof")
    }

});