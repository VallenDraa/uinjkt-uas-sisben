export const changeBlobToImage = (blob: Blob) => {
  const blobUrl = URL.createObjectURL(blob);

  return {
    url: blobUrl,
    cleanup: () => URL.revokeObjectURL(blobUrl),
  };
};
