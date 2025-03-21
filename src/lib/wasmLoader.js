const wasmLoader = async (wasmUrl) => {
    try {
        const wasmBinary = await fetch(wasmUrl).then((res) =>
            res.arrayBuffer()
        );

        const { instance } = await WebAssembly.instantiate(wasmBinary, {
            env: {
                memoryBase: 0,
                tableBase: 0,
                memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
                table: new WebAssembly.Table({
                    initial: 0,
                    element: "anyfunc",
                }),
                abort: (msg, file, line, column) =>
                    console.error(
                        "wasmLoader - abort:",
                        msg,
                        file,
                        line,
                        column
                    ),
            },
        });

        return instance.exports;
    } catch (error) {
        console.error("wasmLoader - error:", error);
        return null;
    }
};

export default wasmLoader;
