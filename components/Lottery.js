import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function Lottery() {
    const { chainId: chainIdHex, isWeb3Enabled, isLoading, isFetching } = useMoralis();
    const chainId = parseInt(chainIdHex);
    console.log("chainId", chainId);
    const dispatch = useNotification();

    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

    const [entranceFee, setEntranceFee] = useState("0");
    const [numOfPlayers, setNumOfPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");


    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    console.log("raffleAddress", raffleAddress);

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });
    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });
    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
        params: {},
    });

    async function updateUI() {
        if (isWeb3Enabled) {
            const entranceFeeFromCall = (await getEntranceFee()).toString();
            const numOfPlayersFromCall = (await getNumOfPlayers()).toString();
            const recentWinnerFromCall = await getRecentWinner();
            setEntranceFee(entranceFeeFromCall);
            setNumOfPlayers(numOfPlayersFromCall);
            setRecentWinner(recentWinnerFromCall);
            console.log("Entrancefee", entranceFee);
            console.log("numOfPlayers", numOfPlayers);
            console.log("recentWinner", recentWinner);
        }
    }

    useEffect(() => {

        updateUI();
    }, [isWeb3Enabled]);
    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNotification(tx);
        updateUI();
    }
    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Raffle entered",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        });
    }
    return (
        <div className="p-5">
            Hi from lottery entrace!
            {
                raffleAddress ? (
                    <div>  <button onClick={async function () {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),

                        })
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        disabled={isLoading || isFetching}>{(isLoading || isFetching) ? (<div className="animate-spin spinner-border h-8 w-8 border b-2 rounded-full"></div>) : (<div>Enter Raffle</div>)}</button>
                        <br /><br />
                        Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH <br />
                        Number of Players: {numOfPlayers}<br />
                        Recent Winner: {recentWinner}<br />
                    </div >
                ) :
                    (
                        <div>No Raffle addreess detected</div>
                    )
            }
        </div>);
};