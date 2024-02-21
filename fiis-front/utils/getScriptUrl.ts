export const getScriptUrl = () => {
  return process.platform === "win32" 
  ? "ts-node C:/Users/Verdant/Desktop/fiis/fiis-script/src/index.ts" 
  : "npx ts-node /home/verdant/Desktop/fiis/fiis-script/src/index.ts"
}