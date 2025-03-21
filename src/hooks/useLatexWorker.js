import { useState, useEffect, useRef, useCallback } from "react";
import { generateLatexTable as generateLatexTableJs } from "@/lib/latex/latexUtils";

export function useLatexWorker() {
    const [worker, setWorker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const workerRef = useRef(null);
    const requestIdRef = useRef(0);
    const pendingRequestsRef = useRef(new Map());

    useEffect(() => {
        let isMounted = true;
        const initWorker = () => {
            try {
                const workerInstance = new Worker(
                    new URL("../workers/latex.worker.js", import.meta.url),
                    { type: "module" }
                );

                workerInstance.onerror = (err) => {
                    console.error("Worker 오류:", err);
                    if (isMounted) {
                        setError(`Worker 오류: ${err.message}`);
                        setIsLoading(false);
                    }
                };

                workerInstance.onmessage = (event) => {
                    const { id, result, error } = event.data;
                    const pending = pendingRequestsRef.current.get(id);
                    if (pending) {
                        const { resolve, reject } = pending;
                        if (error) {
                            reject(new Error(error));
                        } else {
                            resolve(result);
                        }
                        pendingRequestsRef.current.delete(id);
                    }
                };

                workerRef.current = workerInstance;
                if (isMounted) {
                    setWorker(workerInstance);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Worker 초기화 실패:", err);
                if (isMounted) {
                    setError(`Worker 초기화 실패: ${err.message}`);
                    setIsLoading(false);
                }
            }
        };

        initWorker();

        return () => {
            isMounted = false;
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const callWorkerMethod = (method, args) => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                reject(new Error("Worker 인스턴스가 존재하지 않습니다."));
                return;
            }
            const id = requestIdRef.current++;
            pendingRequestsRef.current.set(id, { resolve, reject });
            workerRef.current.postMessage({ id, method, args });
        });
    };

    const generateLatexTable = useCallback(async (tableData, options = {}) => {
        if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
            return "";
        }
        try {
            const result = await callWorkerMethod("generateLatexTable", [
                tableData,
                options,
            ]);
            return result;
        } catch (err) {
            console.error("LaTeX 생성 오류 (Worker):", err);
            console.log("오류 발생, JavaScript 구현으로 폴백");
            return generateLatexTableJs(tableData, options);
        }
    }, []);

    return {
        worker,
        isLoading,
        error,
        generateLatexTable,
    };
}
