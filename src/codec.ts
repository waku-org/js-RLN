import type {
  IDecodedMessage,
  IDecoder,
  IEncoder,
  IMessage,
  IProtoMessage,
  IRateLimitProof,
} from "@waku/interfaces";
import debug from "debug";

import { RlnMessage, toRLNSignal } from "./message.js";
import { IdentityCredential, RLNInstance } from "./rln.js";

const log = debug("waku:rln:encoder");

export class RLNEncoder implements IEncoder {
  private readonly idSecretHash: Uint8Array;

  constructor(
    private encoder: IEncoder,
    private rlnInstance: RLNInstance,
    private index: number,
    identityCredential: IdentityCredential
  ) {
    if (index < 0) throw "invalid membership index";
    this.idSecretHash = identityCredential.IDSecretHash;
  }

  async toWire(message: IMessage): Promise<Uint8Array | undefined> {
    message.rateLimitProof = await this.generateProof(message);
    log("Proof generated", message.rateLimitProof);
    return this.encoder.toWire(message);
  }

  async toProtoObj(message: IMessage): Promise<IProtoMessage | undefined> {
    const protoMessage = await this.encoder.toProtoObj(message);
    if (!protoMessage) return;

    protoMessage.contentTopic = this.contentTopic;
    protoMessage.rateLimitProof = await this.generateProof(message);
    log("Proof generated", protoMessage.rateLimitProof);
    return protoMessage;
  }

  private async generateProof(message: IMessage): Promise<IRateLimitProof> {
    const signal = toRLNSignal(this.contentTopic, message);

    console.time("proof_gen_timer");
    const proof = await this.rlnInstance.generateRLNProof(
      signal,
      this.index,
      message.timestamp,
      this.idSecretHash
    );
    console.timeEnd("proof_gen_timer");
    return proof;
  }

  get pubsubTopic(): string {
    return this.encoder.pubsubTopic;
  }

  get contentTopic(): string {
    return this.encoder.contentTopic;
  }

  get ephemeral(): boolean {
    return this.encoder.ephemeral;
  }
}

type RLNEncoderOptions = {
  encoder: IEncoder;
  rlnInstance: RLNInstance;
  index: number;
  credential: IdentityCredential;
};

export const createRLNEncoder = (options: RLNEncoderOptions): RLNEncoder => {
  return new RLNEncoder(
    options.encoder,
    options.rlnInstance,
    options.index,
    options.credential
  );
};

export class RLNDecoder<T extends IDecodedMessage>
  implements IDecoder<RlnMessage<T>>
{
  constructor(private rlnInstance: RLNInstance, private decoder: IDecoder<T>) {}

  get pubsubTopic(): string {
    return this.decoder.pubsubTopic;
  }

  get contentTopic(): string {
    return this.decoder.contentTopic;
  }

  fromWireToProtoObj(bytes: Uint8Array): Promise<IProtoMessage | undefined> {
    const protoMessage = this.decoder.fromWireToProtoObj(bytes);
    log("Message decoded", protoMessage);
    return Promise.resolve(protoMessage);
  }

  async fromProtoObj(
    pubsubTopic: string,
    proto: IProtoMessage
  ): Promise<RlnMessage<T> | undefined> {
    const msg: T | undefined = await this.decoder.fromProtoObj(
      pubsubTopic,
      proto
    );
    if (!msg) return;
    return new RlnMessage(this.rlnInstance, msg, proto.rateLimitProof);
  }
}

type RLNDecoderOptions<T extends IDecodedMessage> = {
  decoder: IDecoder<T>;
  rlnInstance: RLNInstance;
};

export const createRLNDecoder = <T extends IDecodedMessage>(
  options: RLNDecoderOptions<T>
): RLNDecoder<T> => {
  return new RLNDecoder(options.rlnInstance, options.decoder);
};
