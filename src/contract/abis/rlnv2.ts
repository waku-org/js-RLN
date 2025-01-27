export const RLN_V2_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "MAX_MEMBERSHIP_SET_SIZE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "MERKLE_TREE_DEPTH",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "Q",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "activeDurationForNewMemberships",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "currentTotalRateLimit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "deployedBlockNumber",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "depositsToWithdraw",
    inputs: [
      {
        name: "holder",
        type: "address",
        internalType: "address"
      },
      {
        name: "token",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "eraseMemberships",
    inputs: [
      {
        name: "idCommitments",
        type: "uint256[]",
        internalType: "uint256[]"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "eraseMemberships",
    inputs: [
      {
        name: "idCommitments",
        type: "uint256[]",
        internalType: "uint256[]"
      },
      {
        name: "eraseFromMembershipSet",
        type: "bool",
        internalType: "bool"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "extendMemberships",
    inputs: [
      {
        name: "idCommitments",
        type: "uint256[]",
        internalType: "uint256[]"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getMembershipInfo",
    inputs: [
      {
        name: "idCommitment",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getMerkleProof",
    inputs: [
      {
        name: "index",
        type: "uint40",
        internalType: "uint40"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256[20]",
        internalType: "uint256[20]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getRateCommitmentsInRangeBoundsInclusive",
    inputs: [
      {
        name: "startIndex",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "endIndex",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "gracePeriodDurationForNewMemberships",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "indicesOfLazilyErasedMemberships",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_priceCalculator",
        type: "address",
        internalType: "address"
      },
      {
        name: "_maxTotalRateLimit",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "_minMembershipRateLimit",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "_maxMembershipRateLimit",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "_activeDuration",
        type: "uint32",
        internalType: "uint32"
      },
      {
        name: "_gracePeriod",
        type: "uint32",
        internalType: "uint32"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "isExpired",
    inputs: [
      {
        name: "_idCommitment",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  }
];
