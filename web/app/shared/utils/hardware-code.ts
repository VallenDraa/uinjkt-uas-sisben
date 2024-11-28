export const hardwareCodeKey = "hardwareCode";

export const getHardwareCode = () => {
  return localStorage.getItem(hardwareCodeKey) || "0kx4HkAbWNFZ";
};

export const setHardwareCode = (code: string) => {
  return localStorage.setItem(hardwareCodeKey, code);
};

export const removeHardwareCode = () => {
  return localStorage.removeItem(hardwareCodeKey);
};
