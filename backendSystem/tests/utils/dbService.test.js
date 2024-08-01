const { PrismaClient } = require("@prisma/client");
const { createTransaction } = require("../../src/utils/dbService");

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    transaction: {
      upsert: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe("createTransaction", () => {
  let prismaMock;
  const chainId = 1;
  const poolAddress = "0xPoolAddress";
  const txnHash = "0xTxnHash";
  const priceInUSDT = 1000;
  const priceInETH = 0.5;
  const ethPriceAt = 2000;
  const txnTimestamp = 1625097600;

  beforeEach(() => {
    prismaMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create or update a transaction successfully", async () => {
    const mockTransaction = { id: 1, txnHash, chainId };
    prismaMock.transaction.upsert.mockResolvedValue(mockTransaction);

    const result = await createTransaction(
      chainId,
      poolAddress,
      txnHash,
      priceInUSDT,
      priceInETH,
      ethPriceAt,
      txnTimestamp
    );

    expect(prismaMock.transaction.upsert).toHaveBeenCalledWith({
      where: {
        chainId_txnHash: {
          chainId,
          txnHash,
        },
      },
      create: {
        chainId,
        poolAddress,
        txnHash,
        priceInUSDT,
        priceInETH,
        ethPriceAt,
        txnTimestamp: new Date(txnTimestamp * 1000),
      },
      update: {
        chainId,
        poolAddress,
        txnHash,
        priceInUSDT,
        priceInETH,
        ethPriceAt,
        txnTimestamp: new Date(txnTimestamp * 1000),
      },
    });
    expect(result).toEqual(true);
  });

  it("should throw an error if the transaction creation/updation fails", async () => {
    const mockError = new Error("Database Error");
    prismaMock.transaction.upsert.mockRejectedValue(mockError);

    await expect(
      createTransaction(
        chainId,
        poolAddress,
        txnHash,
        priceInUSDT,
        priceInETH,
        ethPriceAt,
        txnTimestamp
      )
    ).rejects.toThrow(`Error creating transaction: ${mockError.message}`);
  });
});
