import { useState } from 'react';
import { MaterialRequiringReview, MaterialSuggestion } from '../../../interfaces/csvUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search, Check, X, Undo2 } from 'lucide-react';
import { Badge } from '../../ui/badge';

interface MaterialReviewListProps {
    materials: MaterialRequiringReview[];
    selectedMappings: Record<string, MaterialSuggestion>;
    onMappingChange: (mappings: Record<string, MaterialSuggestion>) => void;
}

export function MaterialReviewList({
    materials,
    selectedMappings,
    onMappingChange,
}: MaterialReviewListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectSuggestion = (materialId: string, suggestion: MaterialSuggestion) => {
        onMappingChange({
            ...selectedMappings,
            [materialId]: suggestion
        });
    };

    const handleUnmap = (materialId: string) => {
        const newMappings = { ...selectedMappings };
        delete newMappings[materialId];
        onMappingChange(newMappings);
    };

    const getConfidenceBadge = (confidenceLevel: string) => {
        const variants = {
            high: 'success',
            medium: 'warning',
            low: 'destructive',
        } as const;

        return (
            <Badge variant={variants[confidenceLevel as keyof typeof variants]}>
                {confidenceLevel}
            </Badge>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Materials Requiring Review</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search materials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {filteredMaterials.map((material) => (
                    <div
                        key={material.id}
                        className="border rounded-lg p-4 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">{material.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {material.occurrences} occurrence{material.occurrences > 1 ? 's' : ''}
                                </p>
                            </div>
                            {selectedMappings[material.id] && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        Mapped to: {selectedMappings[material.id].name}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUnmap(material.id)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <Undo2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            {material.suggestions.length > 0 ? (
                                material.suggestions.map((suggestion, index) => (
                                    <div
                                        key={`${material.id}-${suggestion.name}-${index}`}
                                        className={`flex justify-between items-center p-3 rounded-md border
                                            ${selectedMappings[material.id]?.name === suggestion.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{suggestion.name}</span>
                                                {getConfidenceBadge(suggestion.confidenceLevel)}
                                                {suggestion.isBestMatch && (
                                                    <Badge variant="secondary">Best Match</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{suggestion.activityName}</p>
                                        </div>
                                        <Button
                                            variant={selectedMappings[material.id]?.name === suggestion.name
                                                ? "secondary"
                                                : "outline"
                                            }
                                            onClick={() => handleSelectSuggestion(material.id, suggestion)}
                                        >
                                            {selectedMappings[material.id]?.name === suggestion.name
                                                ? <Check className="h-4 w-4 mr-1" />
                                                : "Select"
                                            }
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-4 border rounded-md bg-gray-50">
                                    <X className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">No suggestions available</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
} 