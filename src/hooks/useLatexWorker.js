import { useEffect, useState } from "react";
import { wrap } from "comlink";

export function useLatexWorker() {
    const [worker, setWorker] = useState(null);
    const [isWasmAvailable, setIsWasmAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const workerInstance = new Worker(
            new URL("../workers/latex-worker.js", import.meta.url),
            { type: "module" }
        );

        const wrappedWorker = wrap(workerInstance); // Wrap with comlink

        wrappedWorker.initWasmModule().then((success) => {
            setIsWasmAvailable(success);
            setIsLoading(false);
        });

        setWorker(wrappedWorker);

        return () => {
            workerInstance.terminate();
        };
    }, []);

    return { worker, isWasmAvailable, isLoading };
}
