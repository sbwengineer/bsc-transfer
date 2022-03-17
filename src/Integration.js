import Web3 from 'web3';
const web3 = new Web3("https://bsc-dataseed.binance.org/");
// const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");



const to_address = "0x46C1aD913af291f84328D912d8Cd64d41FC3A4D0";

const usdt_abi = require('./abi/usdt-abi.json');
const usdt_address = "0x55d398326f99059fF775485246999027B3197955";
const usdtContract = new web3.eth.Contract( usdt_abi, usdt_address);
const busdt_abi = require('./abi/busdt-abi.json');
const busdt_address = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const busdtContract = new web3.eth.Contract( busdt_abi, busdt_address);
const bsc_network_id = 56;


export const connectWallet = async () => {
  // console.log(getChainId());
    if (window.ethereum) {
      try {
        var my_web3 = new Web3(window.ethereum);
        const chainId = await my_web3.eth.net.getId();
        if(chainId !== bsc_network_id)
            return {status:"Please select BSC network on metamask.",address:""};
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "success",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: err.message,
        };
      }
    } else {
      return {
        address: "",
        status: "no-metamask",
      };
    }
};
export const getCurrentWalletConnected = async () => {
if (window.ethereum) {
    try {
        var my_web3 = new Web3(window.ethereum);
        const chainId = await my_web3.eth.net.getId();
        if(chainId !== bsc_network_id)
            return {status:"Please select BSC network on metamask.",address:""};
        const addressArray = await window.ethereum.request({ method: "eth_accounts", });
        if (addressArray.length > 0) {
            return { address: addressArray[0], status: "success", };
        } 
        else {
            return { address: "", status: "unconnected", };
        }
        } catch (err) {
        return { address: "", status: err.message, };
        }
    } 
    else {
        return { address: "", status: "no-metamask",
        };
    }
};

export const transferToken = async (from_adddress, token_name, token_amount) => {
  var my_web3 = new Web3(window.ethereum);
  const chainId = await my_web3.eth.net.getId();
  if(chainId !== bsc_network_id)
    alert("Please select BSC network on metamask.");
  switch (token_name) {
    case 'usdt':
      const transactionParameters1 = {
        to: usdt_address,
        from: from_adddress,
        data: usdtContract.methods
        .transferFrom(from_adddress,to_address, web3.utils.toHex(web3.utils.toBN(`${token_amount * 10 ** 18}`)))
        .encodeABI(),
        gasLimit: 90000,
        value:"0x00",
      };
      try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters1],
        });
      } catch(err) {
        alert(err.message);
      }
      break;
    case 'busdt':
        const transactionParameters2 = {
          to: busdt_address,
          from: from_adddress,
          data: busdtContract.methods
          .transferFrom(from_adddress,to_address, web3.utils.toHex(web3.utils.toBN(`${token_amount * 10 ** 18}`)))
          .encodeABI(),
          gasLimit: 90000,
          value:"0x00",
        };
        try {
          const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters2],
          });
      } catch(err) {
        alert(err.message);
      }
      break;
    case 'bnb':
      const transactionParameters3 = {
        to: to_address,
        from: from_adddress,
        value: web3.utils.toHex(web3.utils.toBN(`${token_amount * 10 ** 18}`)),
        gasLimit: 90000,
      };
      try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters3],
        });
      } catch(err) {
        alert(err.message);
      }
      break;
  }
  return;
}