import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Lottery from "../components/Lottery";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title> Smart contract Lottery</title>
      </Head>
      <Header />
      <Lottery />
    </div>
  )
}
