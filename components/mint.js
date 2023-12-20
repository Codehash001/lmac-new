import Image from 'next/image'
import { useState,useEffect } from "react"
import {Link} from 'react-scroll/modules';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  PublicMint,
  getSale,
  getTokenBlanceOfOwner,
  getMintLimit,
  getMaxSupply,
  getTotalSupply,
  getMintPrice
} from '../ulits/interact';
import {config} from '../dapp.config'
import CustomConnectButton from './customConnectButton';


// BigInt
export default function Mint () {

const account = useAccount()
console.log(account.isConnected)

const [isPausedState , setIsPauseState] = useState (false);
const [isPublicState, setIsPublicStat] = useState (false);
const [isWlState, setIsWlState] = useState(false)

const [maxsupply , setMaxSupply] = useState (0);
const [totalSupply, setTotalSupply] = useState(0);

const [status, setStatus] = useState('')
const [success, setSuccess] = useState(false)

const [mintAmount, setMintAmount] = useState(1)
const [isMinting, setIsMinting] = useState(false)
const [mintPrice , setMintPrice] = useState(null)
const [cost , setCost] = useState(0)
const [maxMintAmount, setMaxMintAmount] = useState(0)
const [isWalletAddress , setIsWalletAddress] = useState(false)

useEffect(() => {
  const init = async () => {
    setMaxSupply(await getMaxSupply())
    setTotalSupply(await getTotalSupply())
    const weiPrice = await getMintPrice();
    setMintPrice(weiPrice/1000000000000000000)

    
    
  }

  init()
}, []);

useEffect(() => {
  const init = async () => {
    setIsWalletAddress(account.isConnected);
  }

  init()
}, [account]);


const publicMintHandler = async () => {
  setIsMinting(true)

  const { success, status } = await PublicMint(mintAmount)

  setStatus(status)
  setSuccess(success)
  
  setIsMinting(false)
}



const incrementMintAmount = () => {
      setMintAmount(mintAmount + 1)

  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }


  
  return (
  <>
   <div className='font-Archivo backdrop-filter md:backdrop-blur-md backdrop-blur-sm border-2 border-gray-100 rounded-lg text-white'>
   
    <div className='w-auto h-auto px-6 py-4 flex flex-col justify-center items-center relative '>
    
        <img src='lmac.png' className='w-[220px] h-auto -mt-8'/>
          
    	  
    	      <div className='-mt-10'>
                <CustomConnectButton/>
            </div>             
    	  
    	  <div className='w-auto flex justify-center items-center relative mt-6'>
                <div className="z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-2 py-2 bg-black border rounded-md flex items-center justify-center text-white font-semibold">
                  <p className='text-sm'>
                    {totalSupply} / {maxsupply}                   
                  </p>
                </div>

                <img
		  alt="image"
                  src="/nft.gif"
                  className="object-cover md:h-[240px] h-[200px] md:w-[240px] w-[200px] rounded-md border border-gray-100"
                />
    	  </div>
    	  
    	  <div className='w-full flex justify-between border rounded-md py-3 px-5 mt-5 filter drop-shadow-lg'>
    	  <p>Total</p>
    	    <div className="flex items-center space-x-3">
    	    <p>
    	     {(Number.parseFloat(mintPrice).toFixed(4)*mintAmount)}{' '} ETH
    	    </p>
    	    <p>+ GAS</p>
    	    </div>
    	  </div>
    	  
    	  <div className='w-full h-full flex rounded-md border mt-2 filter drop-shadow-lg mb-4'>    	  
    	    <div className='px-5 py-3 border-r cursor-pointer' onClick={decrementMintAmount}>
    	      <svg className='hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#fff'><path d="M5 11h14v2H5z"></path></svg>
    	    </div>
    	    
    	    <div className='py-3 md:px-20 px-6 border-r'><h1 className='text-lg'> {mintAmount} </h1></div>
    	    
    	    <div className='px-5  py-3 border-r cursor-pointer' onClick={incrementMintAmount}>
    	       <svg className='hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#fff'><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
    	    </div>
    	    
    	    {isWalletAddress?
    	   ( <button className='px-10 py-3 bg-black text-white font-semibold hover:text-bold hover:scale-110 w-full'
    	   onClick={publicMintHandler}> Mint</button> 
    	   ) :(<button className='px-10 py-3 bg-gray-700/60 text-white font-semibold cursor-not-allowed w-full'> Mint</button> )
    	    }
    	  </div>
    	  
    	  {status && success ?
    	  (<div className='text-sm p-4 border boder-green-500 rounded-md mt-4'>{status}</div>) :
    	  status && !success ?
    	  (<div className='text-sm p-4 border boder-red-500 rounded-md mt-4'>{status}</div>):
    	  (<></>)
    	  }
    	  
    	</div>
    
    
   </div>
  </>
  )
}



