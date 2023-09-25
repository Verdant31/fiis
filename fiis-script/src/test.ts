import { isAfter, isBefore, parse } from "date-fns";

const dataString1 = "10/09/2023";
const dataString2 = "15/09/2023";

// Converte as datas no formato "dd/mm/yyyy" em objetos Date
const data1 = parse(dataString1, "dd/MM/yyyy", new Date());
const data2 = parse(dataString2, "dd/MM/yyyy", new Date());
console.log("data1", data1);
// Compara as datas usando isBefore ou isAfter
if (isBefore(data1, data2)) {
  console.log("A data 1 é anterior à data 2.");
} else if (isAfter(data1, data2)) {
  console.log("A data 1 é posterior à data 2.");
} else {
  console.log("As datas são iguais.");
}
