import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/lib/creators";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";

interface SummaryCardsProps {
    metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Creators Card - Primary Green Gradient */}
            <Card className="bg-linear-to-br from-primary to-emerald-600 text-white border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">
                        Total Creators
                    </CardTitle>
                    <Users className="h-4 w-4 opacity-75" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalCreators}</div>
                    {/* <p className="text-xs opacity-75">
                        +20.1% from last month
                    </p> */}
                </CardContent>
            </Card>

            {/* Active Creators */}
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Creators
                    </CardTitle>
                    <Activity className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                        {metrics.activeCreators}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Currently active on platform
                    </p>
                </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground flex items-center gap-1 ">
                       <DollarSign className="h-4 w-4 text-black" /> {metrics.totalRevenue.toFixed(2)}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">
                        +15% from last month
                    </p> */}
                </CardContent>
            </Card>

            {/* Avg Revenue / Active */}
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg. Rev / Active
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground flex items-center gap-1 ">
                        <DollarSign className="h-4 w-4 text-black" />
                         
                        {metrics.avgRevenuePerActive.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Per active creator avg.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
