export const getDate: () => string = () => {
  const newDate = new Date();
  return newDate.toLocaleDateString();
};
