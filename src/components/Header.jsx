import { useSDK } from "@metamask/sdk-react";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppContext } from "../App";

const Header = () => {
  const { account, setAccountHandler } = useContext(AppContext);

  const { sdk } = useSDK(); // 이렇게 쓰기만 하면 불러와지는 명령어도 포함됨. 따로 실행할 필요 없이.

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccountHandler(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-blue-100 w-full max-w-screen-md fixed left-1/2 -translate-x-1/2  top-0 flex justify-between ">
        <div>
          <Link to="/">Home</Link>
          <Link to="/mint">Mint</Link>
        </div>
        <div>
          {account ? (
            <div>{account}</div>
          ) : (
            <button onClick={onClickMetaMask}>MetaMask Login</button>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
