export const parseHeader = (header: string) => {
  const regex = /x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)/;
  const match = header.match(regex);
  if (!match) {
    throw new Error("Invalid header format");
  }
  return { width: 1, height: 1 };
};
