import { useState } from 'react';
import { MaterialRequiringReview, MaterialSuggestion } from '../../../interfaces/csvUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search, Check, X, Undo2, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { productsService } from '../../../services/products';
import { useToast } from '../../../hooks/use-toast';
import { AlternativeSuggestionsModal } from './AlternativeSuggestionsModal';
import { EcoinventActivity } from '../../../interfaces/ecoinvent';

interface MaterialReviewListProps {
    materials: MaterialRequiringReview[];
    selectedMappings: Record<string, MaterialSuggestion>;
    onMappingChange: (mappings: Record<string, MaterialSuggestion>) => void;
    onMaterialUpdate: (updatedMaterial: MaterialRequiringReview) => void;
}

export function MaterialReviewList({
    materials,
    selectedMappings,
    onMappingChange,
    onMaterialUpdate,
}: MaterialReviewListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshingMaterialId, setRefreshingMaterialId] = useState<string | null>(null);
    const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);
    const [selectedMaterialName, setSelectedMaterialName] = useState<string>('');
    const [alternatives, setAlternatives] = useState<EcoinventActivity[] | null>(null);
    const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
    const { toast } = useToast();

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

    const handleRefreshSuggestions = async (materialId: string) => {
        try {
            setRefreshingMaterialId(materialId);
            const updatedMaterial = await productsService.refreshSuggestions(materialId);
            onMaterialUpdate(updatedMaterial);
            toast({
                title: 'Suggestions refreshed',
                description: 'New suggestions have been loaded for this material.',
            });
        } catch (error) {
            console.error('Error refreshing suggestions:', error);
            toast({
                title: 'Error refreshing suggestions',
                description: error instanceof Error ? error.message : 'An error occurred while refreshing suggestions',
                variant: 'destructive',
            });
        } finally {
            setRefreshingMaterialId(null);
        }
    };

    const handleSearchAlternatives = async (materialName: string) => {
        setSelectedMaterialName(materialName);
        setAlternativesModalOpen(true);
        setIsLoadingAlternatives(true);
        try {
            const alternatives = await productsService.getAlternativeSuggestions(materialName);
            setAlternatives(alternatives);
        } catch (error) {
            console.error('Error getting alternative suggestions:', error);
            toast({
                title: 'Error getting alternatives',
                description: error instanceof Error ? error.message : 'An error occurred while getting alternative suggestions',
                variant: 'destructive',
            });
            setAlternatives(null);
        } finally {
            setIsLoadingAlternatives(false);
        }
    };

    const handleSelectAlternative = (activity: EcoinventActivity) => {
        const material = materials.find(m => m.name === selectedMaterialName);
        if (material) {
            handleSelectSuggestion(material.id, {
                name: activity.name,
                activityName: activity.name,
                activityUuuid: activity.id,
                referenceProduct: activity.referenceProduct,
                confidence: activity.confidence,
                confidenceLevel: activity.confidence >= 0.7 ? 'high' : activity.confidence >= 0.4 ? 'medium' : 'low',
                confidencePercentage: activity.confidence * 100,
                isBestMatch: false,
                newMapping: true
            });
        }
        setAlternativesModalOpen(false);
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
        <>
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
                                <div className="flex items-center gap-2">
                                    {selectedMappings[material.id] && (
                                        <>
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
                                        </>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRefreshSuggestions(material.id)}
                                        disabled={refreshingMaterialId === material.id}
                                        className="text-gray-500 hover:text-blue-500"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${refreshingMaterialId === material.id ? 'animate-spin' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSearchAlternatives(material.name)}
                                        className="text-gray-500 hover:text-blue-500"
                                    >
                                        <SearchIcon className="h-4 w-4" />
                                    </Button>
                                </div>
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

            <AlternativeSuggestionsModal
                isOpen={alternativesModalOpen}
                onClose={() => setAlternativesModalOpen(false)}
                onSelect={handleSelectAlternative}
                materialName={selectedMaterialName}
                alternatives={alternatives}
                isLoading={isLoadingAlternatives}
            />
        </>
    );
} 