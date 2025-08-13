export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

export const readFile = (file: File): Promise<Blob> => {
  const reader = new FileReader();
  const p = new Promise<Blob>((resolve, reject) => {
    reader.onloadend = () => {
      try {
        const { result } = reader;
        if (result) {
          const blob = new Blob([result], { type: file.type });
          resolve(blob);
        }
      } catch (e) {
        reject(new Error("failed to read file", { cause: e }));
      }

      reject(new Error("failed to read file", { cause: "unknown" }));
    };
  });

  reader.readAsArrayBuffer(file);

  return p;
};
