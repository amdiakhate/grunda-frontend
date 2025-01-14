import { useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ImpactResult } from "../../interfaces/product"
import { useStore } from "../../useStore";

interface ImpactFilterProps {
    impactResults: ImpactResult[];
}

export function ImpactFilter({ impactResults }: ImpactFilterProps) {
    const { displayedImpact, setDisplayedImpact } = useStore();

    // Set initial value if displayedImpact is null and we have results
    useEffect(() => {
        if (!displayedImpact?.method && impactResults.length > 0) {
            setDisplayedImpact({
                method: impactResults[0].method,
                unit: impactResults[0].unit
            });
        }
    }, [impactResults, displayedImpact, setDisplayedImpact]);

    return (
        <Select 
            value={displayedImpact?.method || undefined}
            onValueChange={(method) => setDisplayedImpact({ method, unit: impactResults.find(i => i.method === method)?.unit || '' })}
        >
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select impact method" />
            </SelectTrigger>
            <SelectContent>
                {impactResults.map((impact) => (
                    <SelectItem key={impact.method} value={impact.method}>
                        {impact.method}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
