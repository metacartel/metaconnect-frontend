import Web3 from "web3";
import {
  convertStringToNumber,
  convertNumberToString
} from "../helpers/bignumber";

/**
 * @desc web3 http instance
 */
export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/`)
);

web3Instance.eth.getTransactionReceiptMined = getTransactionReceiptMined;

/**
 * @desc set a different web3 provider
 * @param {String}
 */
export const web3SetHttpProvider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      "function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint"
    );
  }
  return web3Instance.setProvider(providerObj);
};

/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String}
 */
export const toChecksumAddress = address => {
  if (typeof address === "undefined") return "";

  address = address.toLowerCase().replace("0x", "");
  const addressHash = web3Instance.utils.sha3(address).replace("0x", "");
  let checksumAddress = "0x";

  for (let i = 0; i < address.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
};

/**
 * @desc validate ethereum address
 * @param  {Number} wei
 * @return {Boolean}
 */
export const isValidAddress = address => {
  if (address.substring(0, 2) !== "0x") return false;
  else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
  else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  )
    return true;
  else return address === toChecksumAddress(address);
};

/**
 * @desc convert from wei to ether
 * @param  {Number} wei
 * @return {BigNumber}
 */
export const fromWei = wei => web3Instance.utils.fromWei(wei);

/**
 * @desc convert from ether to wei
 * @param  {Number} ether
 * @return {BigNumber}
 */
export const toWei = ether => web3Instance.utils.toWei(ether);

/**
 * @desc hash string with sha3
 * @param  {String} string
 * @return {String}
 */
export const sha3 = string => web3Instance.utils.sha3(string);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, "pending");

/**
 * @desc get transaction by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getTransactionByHash = hash =>
  web3Instance.eth.getTransaction(hash);

/**
 * @desc get block by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getBlockByHash = hash => web3Instance.eth.getBlock(hash);

/**
 * @desc get account ether balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
export const getAccountBalance = async address => {
  const wei = await web3Instance.eth.getBalance(address);
  const ether = fromWei(wei);
  const balance =
    convertStringToNumber(ether) !== 0 ? convertNumberToString(ether) : 0;
  return balance;
};

/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async ({
  from,
  to,
  data,
  value,
  gasPrice,
  gasLimit
}) => {
  const _gasPrice = gasPrice || (await web3Instance.eth.getGasPrice());
  const estimateGasData = value === "0x00" ? { from, to, data } : { to, data };
  const _gasLimit =
    gasLimit || (await web3Instance.eth.estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  const tx = {
    from: from,
    to: to,
    nonce: web3Instance.utils.toHex(nonce),
    gasPrice: web3Instance.utils.toHex(_gasPrice),
    gasLimit: web3Instance.utils.toHex(_gasLimit),
    gas: web3Instance.utils.toHex(_gasLimit),
    value: web3Instance.utils.toHex(value),
    data: data
  };
  return tx;
};

/**
 * @desc send signed transaction
 * @param  {String}  signedTx
 * @return {Promise}
 */
export const web3SendSignedTransaction = signedTx =>
  new Promise((resolve, reject) => {
    const serializedTx = typeof signedTx === "string" ? signedTx : signedTx.raw;
    web3Instance.eth
      .sendSignedTransaction(serializedTx)
      .once("transactionHash", txHash => resolve(txHash))
      .catch(error => reject(error));
  });

/**
 * @desc web3 send transaction
 * @param  {Object}  transaction { from, to, value, data, gasPrice}
 * @return {Promise}
 */
export const web3SendTransaction = (web3, transaction) =>
  new Promise((resolve, reject) => {
    const from =
      transaction.from.substr(0, 2) === "0x"
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === "0x"
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? toWei(transaction.value) : "0x00";
    const data = transaction.data ? transaction.data : "0x";
    getTxDetails({
      from,
      to,
      data,
      value,
      gasLimit: transaction.gasLimit
    })
      .then(txDetails => {
        if (typeof web3 !== "undefined") {
          web3.eth.sendTransaction(txDetails, (err, txHash) => {
            if (err) {
              reject(err);
            }
            resolve(txHash);
          });
        } else {
          throw new Error(`Web3 is not present`);
        }
      })
      .catch(error => reject(error));
  });

export function getTransactionReceiptMined(txHash, interval) {
  const self = this;
  const transactionReceiptAsync = function(resolve, reject) {
    self.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject),
          interval ? interval : 500
        );
      } else {
        resolve(receipt);
      }
    });
  };

  if (Array.isArray(txHash)) {
    return Promise.all(
      txHash.map(oneTxHash =>
        self.getTransactionReceiptMined(oneTxHash, interval)
      )
    );
  } else if (typeof txHash === "string") {
    return new Promise(transactionReceiptAsync);
  } else {
    throw new Error("Invalid Type: " + txHash);
  }
}
