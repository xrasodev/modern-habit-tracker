export const isDemoMode = (): boolean => {
  const value = localStorage.getItem("isDemoMode");
  return value === "true";
};
