interface CompletionLevelProps {
    level: number;
}

export function CompletionLevel({ level }: CompletionLevelProps) {
    return (
        <div className="flex items-center justify-center">
            <div 
                className={`w-3 h-3 rounded-full ${
                    level >= 100 ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
        </div>
    );
}