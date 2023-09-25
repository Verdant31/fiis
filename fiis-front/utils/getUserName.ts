export const getUserName = () => {
  return localStorage.getItem("userId") || "{}";
};
