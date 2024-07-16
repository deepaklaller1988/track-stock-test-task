const isWindowDefined = typeof window !== "undefined";

export const getToken = isWindowDefined && localStorage.getItem("token");

export const logOut = () => {
  if (isWindowDefined) {
    localStorage.removeItem("token");
  }
};
