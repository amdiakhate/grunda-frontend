import { Material } from "@/interfaces/product";
import { useStore } from "@/stores/useStore";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MaterialsTreemapProps {
    materials: Material[];
    threshold?: number;
}

const COLORS = [
    "#8B3E46",
    "#5E3023",
    "#A15C3E",
    "#1F3730",
    "#729E8C",
];

interface TreemapItem {
    name: string;
    size: number;
    details?: string;
    unit?: string;
    referenceProduct?: string;
}

export function MaterialsTreemap({ materials, threshold = 1 }: MaterialsTreemapProps) {
    const displayedImpact = useStore(state => state.displayedImpact);
    
    if (!displayedImpact || !materials || materials.length === 0) return null;

    const data: TreemapItem[] = materials
        .filter(material => material.impacts)
        .map(material => {
            const mainImpact = material.impacts?.mainActivityImpacts?.find(i => i.method === displayedImpact.method);
            const transformImpact = material.impacts?.transformationActivityImpacts?.find(i => i.method === displayedImpact.method);
            const totalShare = (mainImpact?.share ?? 0) + (transformImpact?.share ?? 0);
            
            return {
                name: material.name,
                size: totalShare,
                details: material.description,
                unit: material.unit,
                referenceProduct: material.referenceProduct
            };
        })
        .filter(item => item.size > 0)
        .sort((a, b) => b.size - a.size);

    if (data.length === 0) return null;

    const mainData = data.filter(item => item.size >= threshold);
    const smallItems = data.filter(item => item.size < threshold);
    const othersSum = smallItems.reduce((sum, item) => sum + item.size, 0);

    const finalData = [
        ...mainData,
        ...(othersSum > 0 ? [{
            name: "Others",
            size: othersSum,
            details: `${smallItems.length} materials: ${smallItems.map(i => i.name).join(', ')}`
        }] : [])
    ];

    if (finalData.length === 0) return null;

    const TreemapCell = ({ item, index }: { item: TreemapItem, index: number }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className="relative rounded-md overflow-hidden opacity-0"
                        style={{
                            flex: item.size,
                            minWidth: '80px',
                            backgroundColor: item.name === "Others" ? "#666666" : COLORS[index % COLORS.length],
                            animation: 'fadeIn 0.3s ease-out forwards',
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <div className="absolute inset-0 p-3 text-white">
                            <div className="text-sm font-medium">{item.name}</div>
                            {item.name !== "Others" && (
                                <>
                                    <div className="absolute bottom-3 left-3">
                                        <div className="text-2xl font-medium">
                                            {item.size.toFixed(1)}
                                        </div>
                                        <div className="text-xs opacity-80">
                                            {displayedImpact?.unit}
                                        </div>
                                    </div>
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center text-[48px] font-light opacity-20"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {item.size.toFixed(0)}%
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        {item.name !== "Others" && (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    {item.size.toFixed(1)}% of total impact
                                </p>
                                <p className="text-sm">
                                    {item.size.toFixed(1)} {displayedImpact?.unit}
                                </p>
                            </>
                        )}
                        {item.details && (
                            <p className="text-sm text-muted-foreground">{item.details}</p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="flex flex-wrap gap-2 min-h-[400px] w-full">
                {finalData.map((item, index) => (
                    <TreemapCell key={index} item={item} index={index} />
                ))}
            </div>
        </>
    );
} 