import {
  createDecoder,
  createEncoder,
  DecodedMessage,
} from "@waku/core/lib/message/version_0";
import {
  generatePrivateKey,
  generateSymmetricKey,
  getPublicKey,
} from "@waku/message-encryption";
import {
  createDecoder as createAsymDecoder,
  createEncoder as createAsymEncoder,
} from "@waku/message-encryption/ecies";
import {
  createDecoder as createSymDecoder,
  createEncoder as createSymEncoder,
} from "@waku/message-encryption/symmetric";
import { expect } from "chai";

import {
  createRLNDecoder,
  createRLNEncoder,
  RLNDecoder,
  RLNEncoder,
} from "./codec.js";
import { epochBytesToInt } from "./epoch.js";
import { RlnMessage } from "./message.js";

import * as rln from "./index.js";

const TestContentTopic = "/test/1/waku-message/utf8";
const EMPTY_PUBSUB_TOPIC = "";

describe("RLN codec with version 0", () => {
  it("toWire", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const rlnEncoder = createRLNEncoder({
      encoder: createEncoder({ contentTopic: TestContentTopic }),
      rlnInstance,
      index,
      credential,
    });
    const rlnDecoder = createRLNDecoder({
      rlnInstance,
      decoder: createDecoder(TestContentTopic),
    });

    const bytes = await rlnEncoder.toWire({ payload });

    expect(bytes).to.not.be.undefined;
    const protoResult = await rlnDecoder.fromWireToProtoObj(bytes!);
    expect(protoResult).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      protoResult!
    ))!;

    expect(msg.rateLimitProof).to.not.be.undefined;
    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(0);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });

  it("toProtoObj", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const rlnEncoder = new RLNEncoder(
      createEncoder({ contentTopic: TestContentTopic }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createDecoder(TestContentTopic)
    );

    const proto = await rlnEncoder.toProtoObj({ payload });

    expect(proto).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      proto!
    )) as RlnMessage<DecodedMessage>;

    expect(msg).to.not.be.undefined;
    expect(msg.rateLimitProof).to.not.be.undefined;

    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(0);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });
});

describe("RLN codec with version 1", () => {
  it("Symmetric, toWire", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const symKey = generateSymmetricKey();

    const rlnEncoder = new RLNEncoder(
      createSymEncoder({
        contentTopic: TestContentTopic,
        symKey,
      }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createSymDecoder(TestContentTopic, symKey)
    );

    const bytes = await rlnEncoder.toWire({ payload });

    expect(bytes).to.not.be.undefined;
    const protoResult = await rlnDecoder.fromWireToProtoObj(bytes!);

    expect(protoResult).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      protoResult!
    ))!;

    expect(msg.rateLimitProof).to.not.be.undefined;
    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(1);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });

  it("Symmetric, toProtoObj", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const symKey = generateSymmetricKey();

    const rlnEncoder = new RLNEncoder(
      createSymEncoder({
        contentTopic: TestContentTopic,
        symKey,
      }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createSymDecoder(TestContentTopic, symKey)
    );

    const proto = await rlnEncoder.toProtoObj({ payload });

    expect(proto).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      proto!
    )) as RlnMessage<DecodedMessage>;

    expect(msg).to.not.be.undefined;
    expect(msg.rateLimitProof).to.not.be.undefined;

    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(1);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });

  it("Asymmetric, toWire", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);

    const rlnEncoder = new RLNEncoder(
      createAsymEncoder({
        contentTopic: TestContentTopic,
        publicKey,
      }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createAsymDecoder(TestContentTopic, privateKey)
    );

    const bytes = await rlnEncoder.toWire({ payload });

    expect(bytes).to.not.be.undefined;
    const protoResult = await rlnDecoder.fromWireToProtoObj(bytes!);

    expect(protoResult).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      protoResult!
    ))!;

    expect(msg.rateLimitProof).to.not.be.undefined;
    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(1);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });

  it("Asymmetric, toProtoObj", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);

    const rlnEncoder = new RLNEncoder(
      createAsymEncoder({
        contentTopic: TestContentTopic,
        publicKey,
      }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createAsymDecoder(TestContentTopic, privateKey)
    );

    const proto = await rlnEncoder.toProtoObj({ payload });

    expect(proto).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      proto!
    )) as RlnMessage<DecodedMessage>;

    expect(msg).to.not.be.undefined;
    expect(msg.rateLimitProof).to.not.be.undefined;

    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch).to.be.gt(0);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(1);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });
});

describe("RLN Codec - epoch", () => {
  it("toProtoObj", async function () {
    const rlnInstance = await rln.create();
    const credential = rlnInstance.generateIdentityCredentials();
    const index = 0;
    const payload = new Uint8Array([1, 2, 3, 4, 5]);

    rlnInstance.insertMember(credential.IDCommitment);

    const rlnEncoder = new RLNEncoder(
      createEncoder({ contentTopic: TestContentTopic }),
      rlnInstance,
      index,
      credential
    );
    const rlnDecoder = new RLNDecoder(
      rlnInstance,
      createDecoder(TestContentTopic)
    );

    const proto = await rlnEncoder.toProtoObj({ payload });

    expect(proto).to.not.be.undefined;
    const msg = (await rlnDecoder.fromProtoObj(
      EMPTY_PUBSUB_TOPIC,
      proto!
    )) as RlnMessage<DecodedMessage>;

    const epochBytes = proto!.rateLimitProof!.epoch;
    const epoch = epochBytesToInt(epochBytes);

    expect(msg).to.not.be.undefined;
    expect(msg.rateLimitProof).to.not.be.undefined;

    expect(msg.verify()).to.be.true;
    expect(msg.verifyNoRoot()).to.be.true;
    expect(msg.epoch).to.not.be.undefined;
    expect(msg.epoch!.toString(10).length).to.eq(9);
    expect(msg.epoch).to.eq(epoch);

    expect(msg.contentTopic).to.eq(TestContentTopic);
    expect(msg.msg.version).to.eq(0);
    expect(msg.payload).to.deep.eq(payload);
    expect(msg.timestamp).to.not.be.undefined;
  });
});
