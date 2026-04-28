declare global {
    interface Window {
        fbq: any;
    }
}

export const initMetaPixel = () => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    window.fbq("init", "1282964636728385");
};
