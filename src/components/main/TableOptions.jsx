import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";

const TableOptions = ({ options, onOptionChange }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onOptionChange(name, type === "checkbox" ? checked : value);
    };

    return (
        <div className="space-y-4">
            {/* 테이블 스타일 */}
            <div className="space-y-1">
                <Label htmlFor="tableStyle" className="text-sm">
                    표 스타일
                </Label>
                <Select
                    value={options.tableStyle}
                    onValueChange={(val) => onOptionChange("tableStyle", val)}
                >
                    <SelectTrigger id="tableStyle" className="w-full">
                        <span>{options.tableStyle}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">기본 스타일</SelectItem>
                        <SelectItem value="booktabs">
                            Booktabs 스타일
                        </SelectItem>
                        <SelectItem value="longtable">
                            Longtable 스타일
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {options.tableStyle === "default" && (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="tableBorder"
                        checked={options.tableBorder}
                        onChange={handleChange}
                        className="rounded"
                    />
                    <Label htmlFor="tableBorder" className="text-sm">
                        테이블 테두리 표시
                    </Label>
                </div>
            )}

            {options.tableStyle !== "longtable" && (
                <div className="space-y-1">
                    <Label htmlFor="tablePosition" className="text-sm">
                        표 위치
                    </Label>
                    <Select
                        value={options.tablePosition}
                        onValueChange={(val) =>
                            onOptionChange("tablePosition", val)
                        }
                    >
                        <SelectTrigger id="tablePosition" className="w-full">
                            <span>{options.tablePosition}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="h">h</SelectItem>
                            <SelectItem value="t">t</SelectItem>
                            <SelectItem value="b">b</SelectItem>
                            <SelectItem value="p">p</SelectItem>
                            <SelectItem value="!h">!h</SelectItem>
                            <SelectItem value="ht">ht</SelectItem>
                            <SelectItem value="htb">htb</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="space-y-1">
                <Label htmlFor="tableCaption" className="text-sm">
                    표 캡션
                </Label>
                <Input
                    id="tableCaption"
                    name="tableCaption"
                    value={options.tableCaption}
                    onChange={handleChange}
                    placeholder="테이블 캡션 입력"
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="tableLabel" className="text-sm">
                    표 라벨
                </Label>
                <Input
                    id="tableLabel"
                    name="tableLabel"
                    value={options.tableLabel}
                    onChange={handleChange}
                    placeholder="tab:mytable"
                />
            </div>
        </div>
    );
};

export default TableOptions;
