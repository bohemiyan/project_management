import { envc } from "../config";

// Construct the BaseURL and webSocketUrl
export const BaseURL = envc.API_URL;
// export const webSocketUrl = `ws://${backendIP}:${backendPort}`;


export const BaseAxiosConfig = async () => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosConfig;
};

