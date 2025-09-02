class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.createContainer();
  }

  createContainer() {
    if (typeof document === "undefined") return;

    this.container = document.createElement("div");
    this.container.id = "toast-container";
    this.container.className =
      "fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none";
    document.body.appendChild(this.container);
  }

  show(message, type = "info", duration = 5000) {
    const id = Date.now() + Math.random();
    const toast = this.createToast(id, message, type);

    this.toasts.push({ id, element: toast, timeout: null });
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-slide-in");
    }, 10);

    const timeout = setTimeout(() => {
      this.remove(id);
    }, duration);

    this.toasts.find((t) => t.id === id).timeout = timeout;

    return id;
  }

  createToast(id, message, type) {
    const toast = document.createElement("div");
    toast.setAttribute("data-toast-id", id);
    toast.className = `
      pointer-events-auto
      max-w-sm w-full
      bg-gradient-to-r
      ${this.getTypeStyles(type)}
      backdrop-blur-sm
      border border-white/20
      rounded-2xl
      shadow-2xl
      p-4
      transform translate-x-full
      transition-all duration-300 ease-out
      animate-pulse-subtle
    `;

    const icon = this.getIcon(type);

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 mt-0.5">
          ${icon}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white leading-relaxed">${message}</p>
        </div>
        <button 
          onclick="window.toastManager.remove(${id})"
          class="flex-shrink-0 ml-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    return toast;
  }

  getTypeStyles(type) {
    const styles = {
      success: "from-emerald-500/90 to-green-600/90",
      error: "from-red-500/90 to-rose-600/90",
      warning: "from-amber-500/90 to-orange-600/90",
      info: "from-blue-500/90 to-cyan-600/90",
    };
    return styles[type] || styles.info;
  }

  getIcon(type) {
    const icons = {
      success: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>`,
      error: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>`,
      warning: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>`,
      info: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`,
    };
    return icons[type] || icons.info;
  }

  remove(id) {
    const toastData = this.toasts.find((t) => t.id === id);
    if (!toastData) return;

    if (toastData.timeout) {
      clearTimeout(toastData.timeout);
    }

    const toast = toastData.element;
    toast.classList.add("animate-slide-out");

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, 300);
  }

  clear() {
    this.toasts.forEach((toast) => {
      if (toast.timeout) clearTimeout(toast.timeout);
      if (toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
    });
    this.toasts = [];
  }
}

if (typeof window !== "undefined") {
  window.toastManager = new ToastManager();

  const style = document.createElement("style");
  style.textContent = `
    .animate-slide-in {
      transform: translateX(0) !important;
    }
    
    .animate-slide-out {
      transform: translateX(100%) !important;
      opacity: 0 !important;
    }
    
    .animate-pulse-subtle {
      animation: pulse-subtle 2s infinite;
    }
    
    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.95; }
    }
  `;
  document.head.appendChild(style);
}

export const toast = {
  success: (message, duration) =>
    window.toastManager?.show(message, "success", duration),
  error: (message, duration) =>
    window.toastManager?.show(message, "error", duration),
  warning: (message, duration) =>
    window.toastManager?.show(message, "warning", duration),
  info: (message, duration) =>
    window.toastManager?.show(message, "info", duration),
  clear: () => window.toastManager?.clear(),
};

export default toast;
