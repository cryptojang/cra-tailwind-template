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
  setAccountHandler: () => {},
  web3: undefined,

  contract: undefined,
});

const App = () => {
  const [account, setAccount] = useState("");
  const setAccountHandler = (state) => setAccount(state);

  const { provider } = useSDK(); // 이렇게 쓰기만 하면 불러와지는 명령어도 포함됨. 따로 실행할 필요 없이.

  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState(); // 나중엔 컨트랙트 여러 개 다루어서 contracts  로 담아주게 됨

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
