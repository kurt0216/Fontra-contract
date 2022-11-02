import axios from "axios";

export const pinToIPFS = (formData) => axios({
  method: "post",
  url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  data: formData,
  headers: {
      'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
      'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
      "Content-Type": "multipart/form-data"
  },
});