import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    showActiveOnly: boolean;
    onActiveChange: (value: boolean) => void;
}

export function FilterBar({
    searchTerm,
    onSearchChange,
    showActiveOnly,
    onActiveChange
}: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="active-mode"
                    checked={showActiveOnly}
                    onCheckedChange={onActiveChange}
                    className="data-[state=checked]:bg-emerald-500"
                />
                <Label htmlFor="active-mode" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Show active only
                </Label>
            </div>
        </div>
    );
}
