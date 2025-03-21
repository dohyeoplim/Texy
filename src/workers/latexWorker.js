import { expose } from "comlink";
import { loadWasmModule } from "../utils/wasmLoader";

let wasmModule = null;

// init wasm
async function initWasmModule() {
    wasmModule = await loadWasmModule("/tex-generator.wasm");
    return !!wasmModule;
}

// LaTeX
async function generateLatexTable(tableData, options) {
    if (wasmModule && wasmModule.generateLatexTable) {
        // ....
        return "LaTeX..";
    } else {
        // Fallback
        return "Fallback";
    }
}

// Expose the worker API using Comlink
const workerApi = {
    initWasmModule,
    generateLatexTable,
};

expose(workerApi);
