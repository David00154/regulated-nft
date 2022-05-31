import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import React, { FC, ReactNode, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css'
import side_img from "./assets/side-img.gif"
const state = WalletAdapterNetwork.Mainnet
const App = () => {
  return (
    <Context>
      <Content />
    </Context>
  )
}

export default App

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = state;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = () => {
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet();
  // const [verified]

  // let balance = await connection.getBalance(publicKey!)
  //   console.log(balance / LAMPORTS_PER_SOL)
  // let balance = await connection.getBalance(publicKey!)
  //     if(balance <= 2/ LAMPORTS_PER_SOL){
  //       setErrorMsg()
  //     }
  // HSZPBQ3UkXd5zgQZkwRzCq6LTTfwhkcLozpp6byv5A7U
  const whiteList = async () => {
    setSuccessMsg('')
    setErrorMsg('')
    if (!publicKey) {
      setErrorMsg('Wallet not Connected!')
      return;
    }
    let signature: TransactionSignature = '';
    const reciever = new PublicKey('HSZPBQ3UkXd5zgQZkwRzCq6LTTfwhkcLozpp6byv5A7U')
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: reciever,
          lamports: 1.50 * LAMPORTS_PER_SOL,
        })
      );
      signature = await sendTransaction(transaction, connection);
      setSuccessMsg('Transaction successful! ' + signature)

      await connection.confirmTransaction(signature);
    } catch (error: any) {
      setErrorMsg("Transaction failed! " + error?.message + '' + signature)
      return
    }

  }
  return (
    <div className="lg:grid lg:place-content-center h-screen w-full">
      {/* {successMsg != '' && (<span>{successMsg}</span>)}
      <br />
      {errorMsg != '' && (<span>{errorMsg}</span>)}
      <br />
      {publicKey && (<button onClick={whiteList}>Whitelist</button>)}
      <br />
      <WalletMultiButton /> */}
      <section className='flex lg:flex-row flex-col h-full w-full'>
        {/* <h1 className='text-red-600 text-2xl'>Hello</h1> */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.69)', padding: '40px 30px' }}>
          <h2 style={{ fontSize: '46px', margin: '0 0 20px', fontWeight: '900', color: 'rgb(255, 255, 255)' }}>ReGuLaTeD</h2>
          <p className='mb-5 text-base font-light' style={{ color: 'rgb(255, 255, 255)' }}>We are the 1.69%. Not just a regular NFT collection but a movement that stands by the words 'f*ck regulation'.</p>
          <div className='p-5 bg-[#97979740] flex flex-row justify-between mb-5 rounded-md'>
            <p className='text-white text-sm'>1.5 sol per 1 NFT. 5 NFT max per transaction</p>
          </div>
          {successMsg != '' && (
            <div className='p-5 bg-green-500 flex flex-row justify-between mb-5 rounded-md'>
              <p className='text-white text-sm'>{successMsg}</p>
            </div>
          )}
          {errorMsg != '' && (
            <div className='p-5 bg-red-500 flex flex-row justify-between mb-5 rounded-md'>
              <p className='text-white text-sm'>{errorMsg}</p>
            </div>
          )}

          {!publicKey && (<WalletMultiButton style={{ backgroundColor: '#512da8 !important' }} />)}
          {publicKey && (<button className='text-white bg-[#512da8] h-[48px] flex items-center rounded-md' style={{ padding: '0px 24px' }} onClick={whiteList}>Whitelist</button>)}
        </div>
        <div style={{}}>
          <img src={side_img} className='animation h-auto' alt="" />
        </div>
      </section>
    </div>
  );
};