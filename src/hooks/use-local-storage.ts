export default function useLocalStorage() {
  const addToLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };
  const getFromLocalStorage = (keyName: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(keyName);
    }
    return null;
  };
  return { addToLocalStorage, getFromLocalStorage };
}
