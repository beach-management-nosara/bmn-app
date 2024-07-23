import { useEffect } from 'react';

declare global {
    interface Window {
        hj: any;
        _hjSettings: {
            hjid: number;
            hjsv: number;
        };
    }
}

const initializeHotjar = (hjid: number, hjsv: number) => {
    (function (h: Window, o: Document, t: string, j: string, a?: HTMLHeadElement, r?: HTMLScriptElement) {
        h.hj =
            h.hj ||
            function () {
                (h.hj.q = h.hj.q || []).push(arguments);
            };
        h._hjSettings = { hjid, hjsv };
        a = o.getElementsByTagName('head')[0] as HTMLHeadElement;
        r = o.createElement('script') as HTMLScriptElement;
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
};

const Hotjar = () => {
    useEffect(() => {
        initializeHotjar(5068658, 6);
    }, []);

    return null;
};

export default Hotjar;
