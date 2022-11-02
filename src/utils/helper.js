import Web3 from "web3"

export const fromWei = (value) => {
  return Web3.utils.fromWei(value)
}

export const toWei = (value) => {
  return Web3.utils.toWei(`${value}`)
}