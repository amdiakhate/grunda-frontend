import { Progress } from "@/components/ui/progress"

export function CompletionLevel({ level }: { level: number }) {
    return <Progress value={level} className="w-[60%]" />
}