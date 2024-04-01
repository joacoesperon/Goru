import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [amount, setAmount] = useState(0);
  const [progress, setProgress] = useState(22); // Ejemplo de progreso del 50%

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []); // Añade [] como segundo argumento

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicita al usuario que conecte su billetera
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Crea un proveedor Ethers.js a partir de la conexión de MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        //console.log("Web3Provider instance created successfully.");
        // Obtiene el signer (que representa la cuenta del usuario)
        const signer = await provider.getSigner();
        setSigner(signer);
        //console.log("Usuario conseguido.");
        // Obtiene la dirección de la cuenta del usuario
        const address = await signer.getAddress();
        setSignerAddress(address);
        //console.log("Dirrecion conseguida.");
        //conectado
        setIsConnected(true);
        //console.log("Realizo toda la funcion")
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  const toWei = ether => ethers.parseEther(ether);

  async function execute() {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = "0xc81Da9b929A820f3d9B8F4210B36c8208d11BbDC";
      const abi = [
        {
          "type": "constructor",
          "inputs": [
            {
              "name": "_rate",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_wallet",
              "type": "address",
              "internalType": "address payable"
            },
            {
              "name": "_token",
              "type": "address",
              "internalType": "contract ERC20"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "fallback",
          "stateMutability": "payable"
        },
        {
          "type": "receive",
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "buyTokens",
          "inputs": [
            {
              "name": "_beneficiary",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "rate",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "token",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "contract ERC20"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "wallet",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address payable"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "weiRaised",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "event",
          "name": "TokenPurchase",
          "inputs": [
            {
              "name": "purchaser",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "beneficiary",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "value",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        }
      ];
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const wei = toWei(amount);
        // Ensure signerAddress is defined and valid before using it
        if (signerAddress) {
          await contract.buyTokens(signerAddress, { value: wei });
        } else {
          console.error("Signer address is not set");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  return (
    <div>
      {/* Encabezado de la página */}
      < Head >
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Goru</title>
        {/* Agregar el icono */}
        <link rel="/favicon.ico" href="/favicon.ico" />
      </Head >

      <div className={styles.container}>
        <div className={styles.top}>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#wtf">WTF is GORU</a></li>
            <li><a href="#howtobuy">How to buy</a></li>
            <li><a href="#gorunomics">Gorunomics</a></li>
          </ul>
          <button className={styles.connectButton} onClick={() => connect()}>
            {hasMetamask ? (
              isConnected ? (
                "Connected!"
              ) : (
                "Connect"
              )
            ) : (
              "Please install MetaMask"
            )}
          </button>
          <div className={styles.navRedes}>
            <a href="https://twitter.com/GoruCoin" target="_blank">
              <Image src="/tw.png" alt="twitter" width={25} height={25} />
            </a>
          </div>
        </nav>

        {/* Container About */}
        <div id="about" className={styles.containerAbout}>

          <div className={styles.containerAboutTop}>
            <Image src="/icono2.png" alt="icono" width={250} height={250} priority />
            <h1>goru</h1>
          </div>
          <div className={styles.containerAboutPreSale}>
            <h2>Presale</h2>
            <p >PRICE: 1 GORU = $0.0043</p>
            <p >PROGRESS: {progress} BNB / 100 BNB</p>
            <div className={styles.headerpresaleinput}>
              <input type="text" id="quantityInput" placeholder="Enter BNB Amount"
                onChange={e => setAmount(e.target.value)} />
              <span>BNB</span>
            </div>
            <div className={styles.buttonContainer}>
              {isConnected && (
                <button className={`${styles.executeButton} executeButton`} onClick={() => execute()}>
                  BUY TOKEN
                </button>
              )}
            </div>
            <p >YOU WILL RECIVE: {(amount * 133333) + " GORU"}</p>
          </div>
        </div>
        <div className={styles.division}>

        </div>

        {/* Container About */}
        <div id="wtf" className={styles.containerWtf}>
          <div className={styles.containerWtf1}>
            <h3>pump goru</h3>
            <Image src="/foto1.png" alt="goru" width={400} height={400} priority />
          </div>
          <div className={styles.containerWtf2}>
            <h3>goru is wild</h3>
            <strong>
              <p>GURU WILL SAVE BSC FROM ALL THE USELESS MEMECOINS AND SEND ALL OF THEM TO THE ZOO</p>
            </strong>
          </div>
          <div className={styles.containerWtf3}>
            <h3> goru</h3>
            <Image src="/foto2.png" alt="goru" width={350} height={350} priority />
          </div>
        </div>

        <div className={styles.division}>

        </div>


        {/* Container How To Buy */}
        <div id="howtobuy" className={styles.containerHowToBuy}>
          <h2>How to Buy</h2>
          <div className={styles.containerHowToBuyBloques}>
            <div className={styles.containerHowToBuyBloques1}>
              <h4>Create a wallet</h4>
              <strong>
                <p>Download Metamask or your wallet choice from the app store or google play for free.
                  Desktop users, download the google chrome extension by going to metamask.io
                </p>
              </strong>
            </div>
            <div className={styles.containerHowToBuyBloques2}>
              <h4>Get some BNB</h4>
              <strong>
                <p>Have BNB in your wallet to switch to Goru. if you dont have any bnb, you can buy directly on
                  metamask,
                  transfer from another wallet, or buy on another exchane and send it to your wallet
                </p>
              </strong>
            </div>
            <div className={styles.containerHowToBuyBloques3}>
              <h4>Go to Pancakeswap</h4>
              <strong>
                <p>Connect to Pancakeswap. Go to pancakeswap.finance in google chrome or on the browser inside
                  your metamask app. Connect your
                  wallet. Paste the goru token adress into pancakeswap, select goru, and confirm. When
                  metamask prompts you for a wallet signature, sign.
                </p>
              </strong>
            </div>
            <div className={styles.containerHowToBuyBloques4}>
              <h4>Switch BNB for GORU</h4>
              <strong>
                <p>Switch BNB for goru. We have ZERO taxes so you dont need to worry about buying with a
                  specific slippage,
                  although you may need to use slippage during times of market volatility.
                </p>
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.division}>

        </div>

        {/* Container Tokenomics */}
        <div id="gorunomics" className={styles.containerTokenomics}>
          <h2>Gorunomics</h2>
          <div className={styles.containerTokenomicsCarteles}>
            <div className={styles.containerTokenomicsCarteles1}>
              <strong>
                <p>45%OF TOKENS GO TO LP</p>
              </strong>
            </div>
            <div className={styles.containerTokenomicsCarteles2}>
              <strong>
                <p>45%OF TOKENS GO TO PRESALE PARTICIPANTS</p>
              </strong>
            </div>
            <div className={styles.containerTokenomicsCarteles3}>
              <strong>
                <p>5%OF TOKENS FOR MARKETING</p>
              </strong>
            </div>
            <div className={styles.containerTokenomicsCarteles4}>
              <strong>
                <p>5%OF TOKENS FOR CEX + FUTURE TEAM</p>
              </strong>
            </div>
          </div>
          <Image src="/fotofondo.png" alt="goru" width={400} height={400} priority />
        </div>
      </div>
    </div >
  );
}