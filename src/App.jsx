import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import Mint from "./pages/mint";
import Header from "./components/Header";
import { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import mintNFTABI from "./mintNFT.json";
import { useSDK } from "@metamask/sdk-react";

export const AppContext = createContext({
  account: "",
  setAccountHandler: () => {}, //얘는 헤더에서 건드려야 해서 만들어줌
  web3: undefined,
  contract: undefined, //setWeb3Handler, setContractHandler는  App.jsx에서 만든 후 사용하기만 하면 되고, 변경해야 할 필요가 없어서 안 만들어줌.
});

const App = () => {
  const [account, setAccount] = useState("");
  const setAccountHandler = (state) => setAccount(state);

  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState(); // 나중엔 컨트랙트 여러 개 다루어서 contracts  로 담아주게 됨.//web3.js 관련 애들

  const { provider } = useSDK(); // 이렇게 쓰기만 하면 불러와지는 명령어도 포함됨. 따로 실행할 필요 없이.

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setContract(
      new web3.eth.Contract(
        mintNFTABI,
        "0xeB885FB90B15cF3D70aCD77505e0AA31e7ef200c"
      )
    );
  }, [web3]);

  return (
    <AppContext.Provider value={{ account, setAccountHandler, web3, contract }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<Main />} />
            <Route path="/mint" element={<Mint />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
