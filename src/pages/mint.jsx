import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import mintNFTABI from "../mintNFT.json";
import axios from "axios";

const Mint = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState(); // 나중엔 컨트랙트 여러 개 다루어서 contracts  로 담아주게 됨
  const [metadata, setMetadata] = useState();

  const { sdk, provider } = useSDK(); // 이렇게 쓰기만 하면 불러와지는 명령어도 포함됨. 따로 실행할 필요 없이.

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickMint = async () => {
    try {
      if (!account || !contract) return;
      await contract.methods.mintNFT().send({ from: account });

      const balance = await contract.methods.balanceOf(account).call();

      console.log(Number(balance));

      const newTokenId = await contract.methods
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI = await contract.methods
        .tokenURI(Number(newTokenId))
        .call();

      const response = await axios.get(metadataURI); //주소만 입력하면 가져올 수 잇음

      setMetadata(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setContract(
      new web3.eth.Contract(
        mintNFTABI,
        "0x9eE9a43f81fFA9241637Ca43286f4cC6aaBBb958"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100  max-w-screen-md mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="bg-blue-100 w-full max-w-screen-md mx-auto fixed top-0 ">
        {account ? (
          <div>{account}</div>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask Login</button>
        )}
      </div>
      {metadata && (
        <div>
          <img src={metadata.image} alt={metadata.name} />
        </div>
      )}

      <button onClick={onClickMint}>mint</button>
    </div>
  );
};

export default Mint;
