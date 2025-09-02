export const importAllMentorImages = () => {
  const images = import.meta.glob("../assets/MentorImages/*.{jpg,jpeg,png}", {
    eager: true,
    import: "default",
  });

  const imageMap = {};
  for (const path in images) {
    const fileName = path.split("/").pop();
    imageMap[fileName] = images[path];
  }

  return imageMap;
};
