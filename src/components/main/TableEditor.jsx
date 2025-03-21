import React from "react";

const TableEditor = ({ tableData, onCellUpdate, isDarkMode = false }) => {
    const handleCellChange = (rowIndex, colIndex, event) => {
        onCellUpdate(rowIndex, colIndex, event.target.value);
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const moveFocus = (newRow, newCol) => {
            const next = document.querySelector(
                `input[data-row="${newRow}"][data-col="${newCol}"]`
            );
            if (next) {
                next.focus();
            }
        };

        switch (e.key) {
            case "ArrowRight":
                moveFocus(rowIndex, colIndex + 1);
                break;
            case "ArrowLeft":
                moveFocus(rowIndex, colIndex - 1);
                break;
            case "ArrowDown":
            case "Enter":
                moveFocus(rowIndex + 1, colIndex);
                break;
            case "ArrowUp":
                moveFocus(rowIndex - 1, colIndex);
                break;
            default:
                break;
        }
    };

    const handleDoubleClick = (rowIndex, colIndex) => {
        onCellUpdate(rowIndex, colIndex, "");
    };

    if (!tableData || !tableData.length || !tableData[0].length) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                테이블 데이터가 없습니다.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`border p-1 ${
                                        isDarkMode
                                            ? "border-gray-600"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="text"
                                        value={cell}
                                        data-row={rowIndex}
                                        data-col={colIndex}
                                        onChange={(e) =>
                                            handleCellChange(
                                                rowIndex,
                                                colIndex,
                                                e
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, rowIndex, colIndex)
                                        }
                                        onDoubleClick={() =>
                                            handleDoubleClick(
                                                rowIndex,
                                                colIndex
                                            )
                                        }
                                        className={`w-full p-2 text-center rounded transition-colors ${
                                            isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-white focus:bg-gray-600 focus:border-gray-500"
                                                : "bg-white border-gray-300 text-gray-900 focus:bg-gray-50 focus:border-blue-300"
                                        }`}
                                        aria-label={`셀 (${rowIndex + 1}, ${
                                            colIndex + 1
                                        })`}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableEditor;
