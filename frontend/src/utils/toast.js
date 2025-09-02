export const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-300 transform translate-x-full ${
    type === "error"
      ? "bg-gradient-to-r from-red-500 to-pink-500"
      : type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-500"
      : "bg-gradient-to-r from-blue-500 to-cyan-500"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};
