export const getImageURL = (req) => {
  if (!req.file) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};
