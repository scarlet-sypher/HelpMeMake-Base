export const importAllUserImages = () => {
  const images = import.meta.glob('../assets/UserImages/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default',
  });

  const imageMap = {};
  for (const path in images) {
    const fileName = path.split('/').pop(); // e.g. "cat.jpg"
    imageMap[fileName] = images[path];
  }

  return imageMap;
};