import { useContext, useState } from "react";
import { AppContext } from "../App";

import axios from "axios";

const Mint = () => {
  const [metadata, setMetadata] = useState();

  const { contract, account } = useContext(AppContext);

  const onClickMint = async () => {
    try {
      if (!account || !contract) return;
      await contract.methods.mintNFT().send({ from: account });

      const balance = await contract.methods.balanceOf(account).call();

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

  return (
    <div className="bg-red-100  max-w-screen-md mx-auto min-h-screen flex flex-col justify-center items-center">
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
