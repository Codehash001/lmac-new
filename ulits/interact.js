import {config}  from '../dapp.config'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
// global BigInt

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
const contract = require('../artifacts/contracts/contract.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)



//  get current state functions-------------------------------------->


export const getSale = async () => {
  const sale = await nftContract.methods.sale().call()
  return sale
}

export const getTokenBlanceOfOwner = async () => {
  const balance = await nftContract.methods.balanceOf(window.ethereum.selectedAddress).call()
  return balance
}

export const getMintLimit = async () => {
  const limit = await nftContract.methods.mintLimit().call()
  return limit
}

export const getMaxSupply = async () => {
  const limit = await nftContract.methods.maxSupply().call()
  return limit
}

export const getTotalSupply = async () => {
  const limit = await nftContract.methods.totalSupply().call()
  return limit
}


export const getMintPrice = async() => {
  const price = await nftContract.methods.mintPrice().call()
  return price
}

  
  //Set up Public Mint------------------------------------------------------------------------------------>

export const PublicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const mintingAmount = Number(mintAmount)

  let maxLimit = Number(await nftContract.methods.mintLimit().call())
  const NumberMinted = Number(await nftContract.methods.balanceOf(window.ethereum.selectedAddress).call())
  const MintableAmount = maxLimit - NumberMinted
  console.log('Minatble Amount ',MintableAmount)
  
  const ExceededMaxMint = MintableAmount < mintingAmount
  console.log('ExceededMaxMint',ExceededMaxMint)
    // if (ExceededMaxMint) {
    //   return {
    //     success: false,
    //     status: 'Exceeded Max Mint Amount'
    //   }
    //  } 

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
 

  // Set up our Ethereum transaction

  const price = await nftContract.methods.mintPrice().call()
  const ethPrice = Number.parseFloat(price/1000000000000000000).toFixed(18)
  const cost = ethPrice*mintAmount

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(cost), 'ether')
    ).toString(16), // hex
    gas: String(25000 * mintingAmount),
    data: nftContract.methods
      .mint(mintingAmount)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Ooops!:' + error.message
    }
  }
}

