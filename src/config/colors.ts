// Project color palette definition
export const PALETTE = {
    base: {
        green: '#123016',     // Vert foncé
        navy: '#1E3F72',      // Bleu marine
        brown: '#633310',     // Marron
    }
} as const;

// Utility function to get a color
export const getColor = (color: keyof typeof PALETTE.base): string => {
    return PALETTE.base[color];
};

// Get a cyclic color for lists, charts, etc.
export const getCyclicColor = (index: number): string => {
    const colors = Object.values(PALETTE.base);
    return colors[index % colors.length];
}; 