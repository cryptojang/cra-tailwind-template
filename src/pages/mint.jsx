import { useContext, useState } from "react";
import { AppContext } from "../App";
import axios from "axios"; // metadata주소에서 이미지 가져올 때.

const Mint = () => {
  const { contract, account } = useContext(AppContext);

  const [metadata, setMetadata] = useState(); //민트한 다음에 민트한 애가 무엇인지 확인하려고

  const onClickMint = async () => {
    try {
      if (!account || !contract) return;

      await contract.methods.mintNFT().send({ from: account }); //send는 기본적으로 from 필수. 가스비 등도 발생하면 여기에 적음

      //방금 내가 발행한 nft 조회하기 위한 코드
      const balance = await contract.methods.balanceOf(account).call(); //1) 내 지갑 수량 체크 -> ex. 5개 (보통 배열로 발행 순서대로 배열됨)

      const newTokenId = await contract.methods
        .tokenOfOwnerByIndex(account, Number(balance) - 1) // 해당 지갑 주소의 인덱스값 해당 nft의 id 값 조회 가능. (인덱스는 내가 가진 순서. 토큰id는 민팅될 때 id)
        .call();

      const metadataURI = await contract.methods // 그 id 값으로 토큰url 실행해 메타데이터주소 읽어옴.
        .tokenURI(Number(newTokenId))
        .call();

      const response = await axios.get(metadataURI); //주소만 입력하면 가져올 수 잇음. get 통해 경로 조회해서 json 데이터 가져옴

      setMetadata(response.data); //axios 값은 무조건 response.data에 들어잇음. 이걸 메타데이터에 담음.
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-red-100  max-w-screen-md mx-auto min-h-screen flex flex-col justify-center items-center">
      {metadata && (
        <div>
          <img src={metadata.image} alt={metadata.name} />
          <div>{metadata.name}</div>
          <div>{metadata.description}</div>
          {metadata.attributes.map((v, i) => (
            <div key={i}>
              {v.trait_type}: {v.value}
            </div>
          ))}
        </div>
      )}
      <button onClick={onClickMint}>mint</button>
    </div>
  );
};

export default Mint;
