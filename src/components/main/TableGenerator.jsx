import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLatexWorker } from "@/hooks/useLatexWorker";
import TableEditor from "./TableEditor";
import TableOptions from "./TableOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LatexTableGenerator = () => {
    const {
        isLoading: workerLoading,
        error: workerError,
        generateLatexTable,
    } = useLatexWorker();

    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [tableData, setTableData] = useState([]);
    const [latexCode, setLatexCode] = useState("");
    const [options, setOptions] = useState({
        tableBorder: true,
        tableCaption: "My Table",
        tableLabel: "tab:mytable",
        tablePosition: "h",
        tableStyle: "default",
        useWebGL: false,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const generatingRef = useRef(false);

    useEffect(() => {
        const initData = () => {
            const data = Array.from({ length: rows }, (_, i) =>
                Array.from({ length: cols }, (_, j) =>
                    i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`
                )
            );
            setTableData(data);
        };
        initData();
        try {
            const saved = localStorage.getItem("latexTableData");
            if (saved) {
                const parsed = JSON.parse(saved);
                setTableData(parsed.tableData || data);
                setRows(parsed.rows || rows);
                setCols(parsed.cols || cols);
                if (parsed.options)
                    setOptions((prev) => ({ ...prev, ...parsed.options }));
            }
        } catch (e) {
            console.error(e);
            setError("Error loading saved data.");
        }
    }, []);

    const saveData = useCallback(() => {
        try {
            localStorage.setItem(
                "latexTableData",
                JSON.stringify({
                    tableData,
                    rows,
                    cols,
                    options,
                    lastSaved: new Date().toISOString(),
                })
            );
        } catch (e) {
            console.error("데이터 저장 실패:", e);
            setError("데이터를 저장하는 중 오류가 발생했습니다.");
        }
    }, [tableData, rows, cols, options]);

    const handleSaveDataAction = useCallback(() => {
        saveData();
        alert("저장 완료! 화이팅하세용 💪");
    }, [saveData]);

    const generateLatex = useCallback(async () => {
        // generatingRef를 이용해 이미 진행 중인 경우 실행되지 않도록 함.
        if (generatingRef.current) return;
        generatingRef.current = true;
        setIsGenerating(true);
        setError(null);
        try {
            const latex = await generateLatexTable(tableData, options);
            setLatexCode(latex);
        } catch (err) {
            console.error("LaTeX 생성 실패:", err);
            setError(`LaTeX 코드 생성 중 오류가 발생했습니다: ${err.message}`);
        } finally {
            generatingRef.current = false;
            setIsGenerating(false);
        }
    }, [tableData, options, generateLatexTable]);

    useEffect(() => {
        if (tableData.length > 0 && tableData[0].length > 0) {
            generateLatex();
        }
    }, [tableData, options, generateLatex]);

    useEffect(() => {
        if (tableData.length && tableData[0].length) generateLatex();
    }, [tableData, options, generateLatex]);

    const handleCellUpdate = (r, c, value) => {
        const newData = [...tableData];
        newData[r][c] = value;
        setTableData(newData);
        saveData();
    };

    const addRow = () => {
        const newRow = Array(cols).fill("");
        setTableData([...tableData, newRow]);
        setRows(rows + 1);
    };

    const removeRow = () => {
        if (rows <= 1) return;
        setTableData(tableData.slice(0, -1));
        setRows(rows - 1);
    };

    const addColumn = () => {
        const newData = tableData.map((row) => [...row, ""]);
        setTableData(newData);
        setCols(cols + 1);
    };

    const removeColumn = () => {
        if (cols <= 1) return;
        setTableData(tableData.map((row) => row.slice(0, -1)));
        setCols(cols - 1);
    };

    const copyToClipboard = async () => {
        if (!latexCode) return;
        try {
            await navigator.clipboard.writeText(latexCode);
            alert("복사 완료! 화이팅 💪");
        } catch (err) {
            console.error(err);
            setError("Clipboard copy failed.");
        }
    };

    const handleOptionChange = (name, value) =>
        setOptions((prev) => ({ ...prev, [name]: value }));

    return (
        <div className="space-y-4">
            {workerLoading && (
                <div className="p-2 rounded bg-blue-50 text-blue-700">
                    Worker 로딩 중 ...
                </div>
            )}
            {(workerError || error) && (
                <div className="p-2 rounded bg-red-50 text-red-700">
                    {workerError || error}
                </div>
            )}

            <Card className="rounded-sm shadow-none">
                <CardHeader>
                    <CardTitle>표 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-8">
                        <div>
                            <div className="text-sm mb-2">행</div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={removeRow}
                                    disabled={rows <= 1}
                                    size="sm"
                                >
                                    –
                                </Button>
                                <span>{rows}</span>
                                <Button
                                    variant="outline"
                                    onClick={addRow}
                                    size="sm"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm mb-2">열</div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={removeColumn}
                                    disabled={cols <= 1}
                                    size="sm"
                                >
                                    –
                                </Button>
                                <span>{cols}</span>
                                <Button
                                    variant="outline"
                                    onClick={addColumn}
                                    size="sm"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>

                    <TableOptions
                        options={options}
                        onOptionChange={handleOptionChange}
                    />

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleSaveDataAction}
                    >
                        표 저장하기
                    </Button>
                </CardContent>
            </Card>

            <Card className="rounded-sm shadow-none">
                <CardHeader>
                    <CardTitle>표 수정하기</CardTitle>
                </CardHeader>
                <CardContent>
                    <TableEditor
                        tableData={tableData}
                        onCellUpdate={handleCellUpdate}
                        isDarkMode={false}
                    />
                </CardContent>
            </Card>

            <Card className="rounded-sm shadow-none">
                <CardHeader>
                    <CardTitle>LaTeX 코드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <pre className="font-mono text-sm whitespace-pre-wrap mb-4">
                        {latexCode}
                    </pre>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={copyToClipboard}
                    >
                        복사하기
                    </Button>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-500">
                {isGenerating ? "코드 생성 중... ⚒️" : "생성 완료!"}
            </div>
        </div>
    );
};

export default LatexTableGenerator;
