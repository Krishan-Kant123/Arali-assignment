import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Creator, SortConfig } from "@/lib/creators";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorTableProps {
    creators: Creator[];
    sortConfig: SortConfig;
    onSortChange: (config: SortConfig) => void;
}

export function CreatorTable({ creators, sortConfig, onSortChange }: CreatorTableProps) {
    const handleSort = (key: keyof Creator) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        onSortChange({ key, direction });
    };

    const getSortIcon = (key: keyof Creator) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/30" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4 text-emerald-600" />
        ) : (
            <ChevronDown className="ml-2 h-4 w-4 text-emerald-600" />
        );
    };

    const activeSortClass = (key: keyof Creator) =>
        sortConfig.key === key ? "text-emerald-700 font-semibold bg-emerald-50/50" : "";

    return (
        <div className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b-slate-100">
                        <TableHead
                            className={cn("cursor-pointer hover:bg-slate-100 transition-colors", activeSortClass("name"))}
                            onClick={() => handleSort("name")}
                        >
                            <div className="flex items-center">
                                Name
                                {getSortIcon("name")}
                            </div>
                        </TableHead>

                        <TableHead
                            className={cn("cursor-pointer hover:bg-slate-100 transition-colors text-right", activeSortClass("followers"))}
                            onClick={() => handleSort("followers")}
                        >
                            <div className="flex items-center justify-end">
                                Followers
                                {getSortIcon("followers")}
                            </div>
                        </TableHead>

                        <TableHead
                            className={cn("cursor-pointer hover:bg-slate-100 transition-colors text-right", activeSortClass("revenue"))}
                            onClick={() => handleSort("revenue")}
                        >
                            <div className="flex items-center justify-end">
                                Revenue
                                {getSortIcon("revenue")}
                            </div>
                        </TableHead>

                        <TableHead className="w-[100px] text-center">Active</TableHead>
                        <TableHead className="text-right">Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creators.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                                    <p className="text-lg font-medium">No Creators found</p>
                                    <p className="text-sm">Try adjusting your filters.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        creators.map((creator) => (
                            <TableRow key={creator.id} className="hover:bg-emerald-50/30 transition-colors border-b-slate-50">
                                <TableCell className="font-medium text-slate-900">{creator.name}</TableCell>
                                <TableCell className="text-right font-medium text-slate-600">
                                    {creator.followers.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right font-medium text-slate-600">
                                    ${creator.revenue.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            creator.active
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-slate-100 text-slate-500"
                                        )}
                                    >
                                        {creator.active ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-slate-500">
                                    {new Date(creator.createdAt).toLocaleDateString("en-US")}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
