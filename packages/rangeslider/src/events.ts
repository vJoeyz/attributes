export const getClientX = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) return e.clientX;

  return e.touches[0].clientX;
};
