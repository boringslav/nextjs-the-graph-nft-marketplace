import Link from "next/link"
import { ConnectButton } from "web3uikit"

const Header = () => {
    return (
        <nav className="flex p-1 border-b-2 flex-row justify-between items-center">
            <h1 className="py-5 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-2 p-6">Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-2 p-6">Sell NFT</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Header
