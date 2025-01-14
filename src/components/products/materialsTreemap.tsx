import { Material } from "@/interfaces/product";
import { useStore } from "@/useStore";
import { getCyclicColor } from "@/config/colors";

interface MaterialsTreemapProps {
    materials: Material[];
}

export function MaterialsTreemap({ materials }: MaterialsTreemapProps) {
    const { displayedImpact } = useStore();

    const data = materials.map((material, index) => ({
        name: material.name,
        value: material.impactResults.find(
            impact => impact.method === displayedImpact?.method
        )?.value || 0,
        share: material.impactResults.find(
            impact => impact.method === displayedImpact?.method
        )?.share || 0,
        color: getCyclicColor(index)
    }));

    return (
        <div className="grid auto-rows-fr gap-2 h-[300px]" 
             style={{ 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
             }}>
            {data.map((item, index) => (
                <div
                    key={index}
                    className="relative rounded-lg p-4 text-white"
                    style={{
                        backgroundColor: item.color,
                        gridColumn: item.share > 30 ? 'span 2' : 'span 1',
                        gridRow: item.share > 30 ? 'span 2' : 'span 1'
                    }}
                >
                    <div className="flex flex-col h-full justify-between">
                        <span className="text-lg font-bold">{item.name}</span>
                        <div>
                            <div>{item.value.toFixed(1)} {displayedImpact?.unit}</div>
                            <div className="opacity-70">{item.share.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 