export type Creator = {
    id: number;
    name: string;
    followers: number;
    revenue: number;
    active: boolean;
    createdAt: string; // ISO date
};

export type SortConfig = {
    key: keyof Creator | null;
    direction: 'asc' | 'desc';
};

export type DashboardMetrics = {
    totalCreators: number;
    activeCreators: number;
    totalRevenue: number;
    avgRevenuePerActive: number;
};

export const creators: Creator[] = [
    { id: 1, name: "Aman", followers: 1200, revenue: 4500, active: true, createdAt: "2025-01-10" },
    { id: 2, name: "Riya", followers: 540, revenue: 0, active: false, createdAt: "2025-01-12" },
    { id: 3, name: "Karan", followers: 9800, revenue: 12000, active: true, createdAt: "2025-01-21" },
    { id: 4, name: "Neha", followers: 9800, revenue: 2000, active: true, createdAt: "2025-02-02" }
];

export function filterCreators(
    creators: Creator[],
    searchQuery: string,
    activeOnly: boolean
): Creator[] {
    const lowerQuery = searchQuery.toLowerCase();

    return creators.filter((creator) => {
        const matchesSearch = creator.name.toLowerCase().includes(lowerQuery);
        const matchesActive = activeOnly ? creator.active : true;
        return matchesSearch && matchesActive;
    });
}

export function sortCreators(
    creators: Creator[],
    config: SortConfig
): Creator[] {
    if (!config.key) return creators;

    return creators.sort((a, b) => {
        const aValue = a[config.key!];
        const bValue = b[config.key!];

        // 1. Primary Sort
        if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;

        // 2. Tie-Breaking (Deterministic / Stable Sort)
        // Rule: If primary values are equal, fallback to Name (ASC), then ID (ASC)

        // Name comparison (using localeCompare for correct string sorting)
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) {
            return nameComparison;
        }

        // ID comparison (Final deterministic fallback)
        return a.id - b.id;
    });
}

export function calculateMetrics(creators: Creator[]): DashboardMetrics {
    const totalCreators = creators.length;

    const activeOnly = creators.filter(c => c.active);
    const activeCreators = activeOnly.length;

    const totalRevenue = creators.reduce((sum, c) => sum + c.revenue, 0);

    // Calculate average revenue for ACTIVE creators only
    const activeRevenue = activeOnly.reduce((sum, c) => sum + c.revenue, 0);

    // Safety check: Prevent division by zero
    const avgRevenuePerActive = activeCreators > 0
        ? activeRevenue / activeCreators
        : 0;

    return {
        totalCreators,
        activeCreators,
        totalRevenue,
        avgRevenuePerActive
    };
}
