import {
    Creator,
    filterCreators,
    sortCreators,
    calculateMetrics,
    SortConfig
} from '@/lib/creators';

const mockCreators: Creator[] = [
    { id: 1, name: "Aman", followers: 100, revenue: 1000, active: true, createdAt: "2025-01-01" },
    { id: 2, name: "Bob", followers: 200, revenue: 2000, active: false, createdAt: "2025-01-02" },
    { id: 3, name: "Charlie", followers: 100, revenue: 500, active: true, createdAt: "2025-01-03" }, // Tie with Aman on followers
    { id: 4, name: "Dave", followers: 300, revenue: 3000, active: true, createdAt: "2025-01-04" },
];

describe('Creator Logic', () => {
    describe('filterCreators', () => {
        it('should filter by name (case-insensitive)', () => {
            const result = filterCreators(mockCreators, 'aman', false);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Aman');
        });

        it('should filter by active status', () => {
            const result = filterCreators(mockCreators, '', true);
            expect(result).toHaveLength(3); // Aman, Charlie, Dave
            expect(result.every(c => c.active)).toBe(true);
        });

        it('should combine search and active filters', () => {
            // "Active only" + Search "Bob" (inactive) -> Should return empty
            const result1 = filterCreators(mockCreators, 'Bob', true);
            expect(result1).toHaveLength(0);

            // "Active only" + Search "Dave" (active) -> Should return Dave
            const result2 = filterCreators(mockCreators, 'Dave', true);
            expect(result2).toHaveLength(1);
            expect(result2[0].name).toBe('Dave');
        });
    });

    describe('sortCreators', () => {
        it('should sort by followers asc', () => {
            const config: SortConfig = { key: 'followers', direction: 'asc' };
            const result = sortCreators(mockCreators, config);

            // Expected: 100 (Aman/Charlie), 200 (Bob), 300 (Dave)
            expect(result[0].followers).toBe(100);
            expect(result[2].followers).toBe(200);
            expect(result[3].followers).toBe(300);
        });

        it('should sort by followers desc', () => {
            const config: SortConfig = { key: 'followers', direction: 'desc' };
            const result = sortCreators(mockCreators, config);

            // Expected: 300 (Dave), 200 (Bob), 100 (Aman/Charlie)
            expect(result[0].followers).toBe(300);
            expect(result[1].followers).toBe(200);
        });

        it('should handle tie-breaking stability (Name ASC)', () => {
            // Aman and Charlie both have 100 followers.
            // Ascending sort: Aman should come before Charlie because 'A' < 'C'.
            const config: SortConfig = { key: 'followers', direction: 'asc' };
            const result = sortCreators(mockCreators, config);

            expect(result[0].name).toBe('Aman');
            expect(result[1].name).toBe('Charlie');
        });

        it('should handle sorting by revenue', () => {
            const config: SortConfig = { key: 'revenue', direction: 'desc' };
            const result = sortCreators(mockCreators, config);

            // 3000 (Dave), 2000 (Bob), 1000 (Aman), 500 (Charlie)
            expect(result[0].name).toBe('Dave');
            expect(result[3].name).toBe('Charlie');
        });
    });

    describe('calculateMetrics', () => {
        it('should calculate correct metrics for mixed list', () => {
            const metrics = calculateMetrics(mockCreators);

            expect(metrics.totalCreators).toBe(4);
            expect(metrics.activeCreators).toBe(3); // Aman, Charlie, Dave
            expect(metrics.totalRevenue).toBe(6500); // 1000 + 2000 + 500 + 3000

            // Avg Active Revenue: (1000 + 500 + 3000) / 3 = 4500 / 3 = 1500
            expect(metrics.avgRevenuePerActive).toBe(1500);
        });

        it('should handle divide-by-zero when no active creators exist', () => {
            const inactiveOnly = mockCreators.filter(c => !c.active); // Just Bob
            const metrics = calculateMetrics(inactiveOnly);

            expect(metrics.activeCreators).toBe(0);
            expect(metrics.avgRevenuePerActive).toBe(0); // Should not be NaN
        });

        it('should handle empty list', () => {
            const metrics = calculateMetrics([]);
            expect(metrics.totalCreators).toBe(0);
            expect(metrics.totalRevenue).toBe(0);
            expect(metrics.avgRevenuePerActive).toBe(0);
        });
    });
});
