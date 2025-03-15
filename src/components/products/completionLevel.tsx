import { Progress } from "@/components/ui/progress"

export function CompletionLevel({ level }: { level: number }) {
    // Déterminer si la complétion est à 100%
    const isComplete = level === 100;
    
    // Appliquer une classe différente pour l'indicateur lorsque la complétion est à 100%
    const indicatorClassName = isComplete ? "bg-green-500" : undefined;
    
    return (
        <Progress 
            value={level} 
            className="w-[60%]" 
            indicatorClassName={indicatorClassName}
        />
    )
}