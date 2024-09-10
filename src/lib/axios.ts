import axios from "axios";

export const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3000/api";

export const api = axios.create({
  baseURL: apiUrl,
});

// Inflação
// http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='PRECOS12_IPCAG12')
// CDB
// https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json
