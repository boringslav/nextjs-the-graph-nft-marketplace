const Moralis = require("moralis-v1/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")

const chainId = process.env.chainId || 31337
const moralisChainId = chainId == "31337" ? "1337" : chainId
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.moralisMasterKey
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

;(async () => {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log("Working with contract address: ", contractAddress)

    const itemListedOptions = {
        //Moralis understands a local chain is 1337
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        tableName: "ItemListed",
        //Topic is the event we want to subscribe to
        topic: "ItemListed(address,address,uint256,uint256)",
        //Event ABI
        abi: [
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "seller",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "nftAddress",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        indexed: false,
                        internalType: "uint256",
                        name: "price",
                        type: "uint256",
                    },
                ],
                name: "ItemListed",
                type: "event",
            },
        ],
    }

    const itemBoughtOptions = {
        //Moralis understands a local chain is 1337
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        tableName: "ItemBought",
        //Topic is the event we want to subscribe to
        topic: "ItemBought(address,address,uint256,uint256)",
        //Event ABI
        abi: [
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "buyer",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "nftAddress",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        indexed: false,
                        internalType: "uint256",
                        name: "price",
                        type: "uint256",
                    },
                ],
                name: "ItemBought",
                type: "event",
            },
        ],
    }
    const itemCanceledOptions = {
        //Moralis understands a local chain is 1337
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        tableName: "ItemCanceled",
        //Topic is the event we want to subscribe to
        topic: "ItemCanceled(address,address,uint256)",
        //Event ABI
        abi: [
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "seller",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "nftAddress",
                        type: "address",
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                ],
                name: "ItemCanceled",
                type: "event",
            },
        ],
    }
    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    })
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
        useMasterKey: true,
    })

    if (listedResponse.success && canceledResponse.success && boughtResponse.success) {
        console.log("Success! Database updating with event info ")
    } else {
        console.log("Something went wrong...")
    }
})()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
