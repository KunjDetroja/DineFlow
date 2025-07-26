export const getFromLocalStorage = (key: string) => {
  try {
    if (!key) return;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting from local storage:", error);
    return null;
  }
};

export const saveToLocalStorage = (key: string, value: unknown) => {
  try {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting to local storage:", error);
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    if (!key) return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from local storage:", error);
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};

export const removeEmptyFields = <T extends Record<string, unknown>>(
  data: T
): T => {
  Object.keys(data).forEach((key) => {
    if (data[key] === "" || data[key] === null || data[key] === undefined) {
      delete data[key];
    }
  });
  return data;
};
