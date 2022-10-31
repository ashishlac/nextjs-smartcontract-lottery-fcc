import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Lottery from "../components/Lottery";
import { useMoralis } from "react-moralis";



export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  console.log("isWeb3Enabled", isWeb3Enabled);
  console.log("chainId", chainId);

  const supportedChains = ["31337", "5"];
  return (
    <div className={styles.container}>
      <Head>
        <title> Smart contract Lottery</title>
      </Head>
      <Header />

      {/* {isWeb3Enabled ? (<div>{supportedChains.includes(parseInt(chainId).toString() ? (<div>test < Lottery /></div>) : (<div>Please connect to supported chains</div>))}</div>) : (<div>Please connect to a wallet</div>)} */}
      {isWeb3Enabled ? (
        <div>
          {supportedChains.includes(parseInt(chainId).toString()) ? (
            <div className="flex flex-row">
              <Lottery className="p-8" />
            </div>
          ) : (
            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
          )}
        </div>
      ) : (
        <div>Please connect to a Wallet</div>
      )}
    </div>
  )
}
