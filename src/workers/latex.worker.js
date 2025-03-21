import { generateLatexTable } from "@/lib/latex/latexUtils";

self.onmessage = async (event) => {
    const { id, method, args } = event.data;
    if (method === "generateLatexTable") {
        try {
            const result = generateLatexTable(...args);
            self.postMessage({ id, result });
        } catch (err) {
            self.postMessage({ id, error: err.message });
        }
    }
};
