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