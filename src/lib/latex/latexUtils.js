/**
 * 테이블 데이터에서 LaTeX 코드 생성
 * @param {Array<Array<string>>} tableData
 * @param {Object} options - 테이블 생성 옵션
 * @returns {string} 생성된 LaTeX 코드
 */
export function generateLatexTable(tableData, options = {}) {
    if (!tableData || !tableData.length || !tableData[0].length) {
        return "";
    }

    const {
        tableBorder = true,
        tableCaption = "",
        tableLabel = "tab:mytable",
        tablePosition = "h",
        tableStyle = "default", // 'default', 'booktabs', 'longtable'
    } = options;

    const numCols = tableData[0].length;
    const lines = [];

    // 테이블 환경 시작
    if (tableStyle === "longtable") {
        lines.push(`\\begin{longtable}`);
    } else {
        lines.push(`\\begin{table}[${tablePosition}]`);
        lines.push(`\\centering`);
    }

    // 열 정렬 형식 생성
    let columnSpec = "";
    if (tableStyle === "booktabs" || tableStyle === "longtable") {
        columnSpec = Array(numCols).fill("c").join("");
    } else {
        columnSpec = tableBorder
            ? `|${Array(numCols).fill("c").join("|")}|`
            : Array(numCols).fill("c").join("");
    }

    // tabular environment
    if (tableStyle === "longtable") {
        lines.push(`{${columnSpec}}`);
        if (tableCaption) {
            lines.push(`\\caption{${escapeLatex(tableCaption)}}\\\\`);
        }
        if (tableLabel) {
            lines.push(`\\label{${tableLabel}}\\\\`);
        }
    } else {
        lines.push(`\\begin{tabular}{${columnSpec}}`);
    }

    // topp rules
    if (tableStyle === "booktabs" || tableStyle === "longtable") {
        lines.push(`\\toprule`);
    } else if (tableBorder) {
        lines.push(`\\hline`);
    }

    const headerRow = tableData[0].map(escapeLatex).join(" & ");
    lines.push(`${headerRow} \\\\`);

    // midrule
    if (tableStyle === "booktabs" || tableStyle === "longtable") {
        lines.push(`\\midrule`);
    } else if (tableBorder) {
        lines.push(`\\hline`);
    }

    for (let i = 1; i < tableData.length; i++) {
        const row = tableData[i].map(escapeLatex).join(" & ");
        lines.push(`${row} \\\\`);
        if (
            tableBorder &&
            i < tableData.length - 1 &&
            tableStyle === "default"
        ) {
            lines.push(`\\hline`);
        }
    }

    // bottomrule
    if (tableStyle === "booktabs" || tableStyle === "longtable") {
        lines.push(`\\bottomrule`);
    } else if (tableBorder) {
        lines.push(`\\hline`);
    }

    // end env
    if (tableStyle === "longtable") {
        lines.push(`\\end{longtable}`);
    } else {
        lines.push(`\\end{tabular}`);
        if (tableCaption) {
            lines.push(`\\caption{${escapeLatex(tableCaption)}}`);
        }
        if (tableLabel) {
            lines.push(`\\label{${tableLabel}}`);
        }
        lines.push(`\\end{table}`);
    }

    return lines.join("\n");
}

/**
 * LaTeX 특수 문자 escape - TODO: escape 안하게 할수도 있도록
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export function escapeLatex(text) {
    if (text === undefined || text === null) {
        return "";
    }

    const escapeMap = {
        "&": "\\&",
        "%": "\\%",
        $: "\\$",
        "#": "\\#",
        _: "\\_",
        "{": "\\{",
        "}": "\\}",
        "~": "\\textasciitilde{}",
        "^": "\\textasciicircum{}",
        "\\": "\\textbackslash{}",
        "<": "\\textless{}",
        ">": "\\textgreater{}",
    };

    return String(text).replace(/[&%$#_{}~^\\<>]/g, (char) => escapeMap[char]);
}

/**
 * 열 정렬 형식 생성
 * @param {number} cols - 열 수
 * @param {Array<string>} alignments - 정렬 값('l', 'c', 'r')
 * @param {boolean} hasBorder - 테두리 유무
 * @returns {string} 열 정렬 문자열
 */
export function generateColumnFormat(cols, alignments = [], hasBorder = false) {
    if (cols <= 0) return "";
    const defaultAlignment = "c";
    const formats = Array.from(
        { length: cols },
        (_, i) => alignments[i] || defaultAlignment
    );
    return hasBorder ? `|${formats.join("|")}|` : formats.join("");
}

/**
 * 지정된 LaTeX 템플릿에서 테이블 생성
 * @param {Array<Array<string>>} tableData
 * @param {string} templateName - 템플릿 이름 ('simple', 'academic', 'colored' 등)
 * @param {Object} options - 추가 옵션
 * @returns {string} 생성된 LaTeX 코드
 */
export function generateFromTemplate(
    tableData,
    templateName = "simple",
    options = {}
) {
    if (!tableData || !tableData.length) return "";

    switch (templateName.toLowerCase()) {
        case "academic":
            return generateAcademicTable(tableData, options);
        case "colored":
            return generateColoredTable(tableData, options);
        case "simple":
        default:
            return generateLatexTable(tableData, options);
    }
}

/**
 * booktabs 스타일
 * @param {Array<Array<string>>} tableData
 * @param {Object} options - 테이블 생성 옵션
 * @returns {string} 생성된 LaTeX 코드
 */
function generateAcademicTable(tableData, options = {}) {
    const academicOptions = {
        tableBorder: false,
        tableStyle: "booktabs",
        ...options,
    };

    let code = generateLatexTable(tableData, academicOptions);

    // footnote 옵션이 있을 경우 테이블 종료 태그 앞에 추가
    if (options.footnote) {
        const endTag = "\\end{table}";
        if (code.includes(endTag)) {
            const footnoteText = `\\footnotesize{${escapeLatex(
                options.footnote
            )}}\n`;
            code = code.replace(endTag, footnoteText + endTag);
        }
    }

    return code;
}

/**
 * Colored table - maybe in the future!!
 * @param {Array<Array<string>>} tableData - 2차원 테이블 데이터
 * @param {Object} options - 테이블 생성 옵션
 * @returns {string} 생성된 LaTeX 코드
 */
function generateColoredTable(tableData, options = {}) {
    const lines = [];
    lines.push("% \\usepackage{xcolor}");
    lines.push("% \\usepackage{colortbl}");
    lines.push("");
    lines.push(`\\begin{table}[${options.tablePosition || "h"}]`);
    lines.push(`\\centering`);

    const headerColor = options.headerColor || "gray!30";
    const rowColors = options.alternateRows ? ["white", "gray!10"] : ["white"];
    const numCols = tableData[0].length;

    lines.push(`\\begin{tabular}{${Array(numCols).fill("c").join("")}}`);
    lines.push(`\\rowcolor{${headerColor}}`);
    const headerRow = tableData[0].map(escapeLatex).join(" & ");
    lines.push(`${headerRow} \\\\ \\hline`);

    for (let i = 1; i < tableData.length; i++) {
        if (options.alternateRows) {
            lines.push(`\\rowcolor{${rowColors[i % rowColors.length]}}`);
        }
        const row = tableData[i].map(escapeLatex).join(" & ");
        lines.push(`${row} \\\\`);
    }
    lines.push(`\\end{tabular}`);

    if (options.tableCaption) {
        lines.push(`\\caption{${escapeLatex(options.tableCaption)}}`);
    }
    if (options.tableLabel) {
        lines.push(`\\label{${options.tableLabel}}`);
    }
    lines.push(`\\end{table}`);

    return lines.join("\n");
}

/**
 * CSV 데이터를 LaTeX 테이블로 변환 (for future use!!)
 * @param {string} csvData - CSV 형식의 문자열
 * @param {Object} options - 변환 옵션
 * @returns {string} 생성된 LaTeX 코드
 */
export function csvToLatexTable(csvData, options = {}) {
    if (!csvData) return "";

    const { delimiter = ",", hasHeader = true, ...tableOptions } = options;
    const rows = csvData.split(/\r?\n/).filter((row) => row.trim());
    const tableData = rows.map((row) =>
        row
            .split(delimiter)
            .map((cell) => cell.trim().replace(/^["'](.*)["']$/, "$1"))
    );

    return generateLatexTable(tableData, tableOptions);
}

/**
 * Transpose
 * @param {Array<Array<string>>} tableData - 2차원 테이블 데이터
 * @returns {Array<Array<string>>} 전치된 테이블 데이터
 */
export function transposeTable(tableData) {
    if (!tableData || !tableData.length) return [];
    const rows = tableData.length;
    const cols = tableData[0].length;
    const result = Array.from({ length: cols }, () => Array(rows).fill(""));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][i] = tableData[i][j];
        }
    }
    return result;
}
