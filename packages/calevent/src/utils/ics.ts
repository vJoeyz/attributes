export const formatDescription = (description: string) => {
  return description
    .replace(/,/gm, ',')
    .replace(/;/gm, ';')
    .replace(/\r\n/gm, '\n')
    .replace(/\n/gm, '\\n')
    .replace(/(\\n)[\s\t]+/gm, '\\n');
};

export const formatLocation = (location: string) => {
  return location
    .replace(/,/gm, ',')
    .replace(/;/gm, ';')
    .replace(/\r\n/gm, '\n')
    .replace(/\n/gm, '\\n')
    .replace(/(\\n)[\s\t]+/gm, '\\n');
};
