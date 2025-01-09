type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
    key: string;
    direction: SortDirection;
}

export function sortItems<T extends Record<string, any>>(items: T[], config: SortConfig | null) {
    if (!config || !config.key || !config.direction) {
        return items;
    }

    return [...items].sort((a, b) => {
        const aValue = String(a[config.key] || '').toLowerCase();
        const bValue = String(b[config.key] || '').toLowerCase();

        if (aValue === bValue) return 0;

        // Handle numeric values
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
            return config.direction === 'asc' 
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        }

        // Handle string values
        return config.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });
} 