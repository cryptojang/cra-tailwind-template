import { useSDK } from "@metamask/sdk-react";
import { useState } from "react";

const Mint = () => {
  const [account, setAccount] = useState("");

  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-center items-center">
      {account ? (
        <>
          <div>{account}</div>
          <button>mint</button>
        </>
      ) : (
        <button onClick={onClickMetaMask}>MetaMask Login</button>
      )}
    </div>
  );
};

export default Mint;
