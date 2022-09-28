import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

const UpdateListingModal = ({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) => {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (error) => console.error(error),
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
            onClose={onClose}
            onCloseButtonPressed={onClose}
            onCancel={onClose}
            title="Edit NFT Price"
            isCentered={true}
        >
            <Input
                style={{ marginBottom: "16px" }}
                label="Update listing price in L1 currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(e) => {
                    setPriceToUpdateListingWith(e.target.value)
                }}
            />
        </Modal>
    )
}

export default UpdateListingModal
