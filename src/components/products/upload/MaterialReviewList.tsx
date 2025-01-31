import { useState } from 'react';
import { MaterialRequiringReview, MaterialSuggestion } from '../../../interfaces/csvUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Search, Check, X, Undo2, Search as SearchIcon, Filter } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { productsService } from '../../../services/products';
import { useToast } from '../../../hooks/use-toast';
import { AlternativeSuggestionsModal } from './AlternativeSuggestionsModal';
import { EcoinventActivity } from '../../../interfaces/ecoinvent';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

type FilterStatus = 'all' | 'mapped' | 'unmapped' | 'noSuggestions' | 'withSuggestions';

interface MaterialReviewListProps {
    materials: MaterialRequiringReview[];
    selectedMappings: Record<string, MaterialSuggestion>;
    onMappingChange: (mappings: Record<string, MaterialSuggestion>) => void;
    onMaterialUpdate?: (updatedMaterial: MaterialRequiringReview) => void;
}

export function MaterialReviewList({
    materials,
    selectedMappings,
    onMappingChange,
    onMaterialUpdate
}: MaterialReviewListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);
    const [selectedMaterialName, setSelectedMaterialName] = useState<string>('');
    const [alternatives, setAlternatives] = useState<EcoinventActivity[] | null>(null);
    const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
    const { toast } = useToast();

    // Filter materials based on search term and status
    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        switch (filterStatus) {
            case 'mapped':
                return matchesSearch && selectedMappings[material.id];
            case 'unmapped':
                return matchesSearch && !selectedMappings[material.id];
            case 'noSuggestions':
                return matchesSearch && material.suggestions.length === 0;
            case 'withSuggestions':
                return matchesSearch && material.suggestions.length > 0;
            default:
                return matchesSearch;
        }
    });

    // Calculate statistics for the filter menu
    const stats = {
        total: materials.length,
        mapped: Object.keys(selectedMappings).length,
        unmapped: materials.length - Object.keys(selectedMappings).length,
        noSuggestions: materials.filter(m => m.suggestions.length === 0).length,
        withSuggestions: materials.filter(m => m.suggestions.length > 0).length,
    };

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
                        <div className="flex items-center gap-4">
                            <CardTitle>Materials Requiring Review</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        {filterStatus === 'all' ? 'All Materials' :
                                         filterStatus === 'mapped' ? 'Mapped' :
                                         filterStatus === 'unmapped' ? 'Unmapped' :
                                         filterStatus === 'noSuggestions' ? 'No Suggestions' :
                                         'With Suggestions'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === 'all'}
                                        onCheckedChange={() => setFilterStatus('all')}
                                    >
                                        All Materials ({stats.total})
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === 'mapped'}
                                        onCheckedChange={() => setFilterStatus('mapped')}
                                    >
                                        Mapped ({stats.mapped})
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === 'unmapped'}
                                        onCheckedChange={() => setFilterStatus('unmapped')}
                                    >
                                        Unmapped ({stats.unmapped})
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === 'noSuggestions'}
                                        onCheckedChange={() => setFilterStatus('noSuggestions')}
                                    >
                                        No Suggestions ({stats.noSuggestions})
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === 'withSuggestions'}
                                        onCheckedChange={() => setFilterStatus('withSuggestions')}
                                    >
                                        With Suggestions ({stats.withSuggestions})
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
                    {filteredMaterials.length === 0 ? (
                        <div className="text-center p-8 border rounded-lg bg-gray-50">
                            <p className="text-gray-500">No materials match the current filters</p>
                        </div>
                    ) : (
                        filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="border rounded-lg p-4 space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-lg">{material.name}</h3>
                                            <Badge variant="outline">
                                                {material.occurrences} occurrence{material.occurrences > 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        {selectedMappings[material.id] && (
                                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
                                                <Check className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">Currently mapped to:</div>
                                                    <div className="text-sm">{selectedMappings[material.id].name}</div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleUnmap(material.id)}
                                                    className="ml-2 text-blue-700 hover:text-red-500 hover:bg-white"
                                                >
                                                    <Undo2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSearchAlternatives(material.name)}
                                        className="text-gray-500 hover:text-blue-500 flex items-center gap-2"
                                    >
                                        <SearchIcon className="h-4 w-4" />
                                        Find Alternatives
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {material.suggestions.length > 0 ? (
                                        material.suggestions.map((suggestion, index) => (
                                            <div
                                                key={`${material.id}-${suggestion.name}-${index}`}
                                                className={`flex justify-between items-center p-4 rounded-md border
                                                    ${selectedMappings[material.id]?.name === suggestion.name
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'hover:bg-gray-50 border-gray-200'
                                                    }`}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{suggestion.name}</span>
                                                        <div className="flex gap-1.5">
                                                            {getConfidenceBadge(suggestion.confidenceLevel)}
                                                            {suggestion.isBestMatch && (
                                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Best Match</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span className="font-medium">Reference Product:</span>
                                                        <span>{suggestion.referenceProduct}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant={selectedMappings[material.id]?.name === suggestion.name
                                                        ? "secondary"
                                                        : "outline"
                                                    }
                                                    onClick={() => handleSelectSuggestion(material.id, suggestion)}
                                                    className={selectedMappings[material.id]?.name === suggestion.name
                                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                        : ""
                                                    }
                                                >
                                                    {selectedMappings[material.id]?.name === suggestion.name ? (
                                                        <>
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Selected
                                                        </>
                                                    ) : (
                                                        "Select"
                                                    )}
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-6 border rounded-md bg-gray-50">
                                            <X className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-600 font-medium">No suggestions available</p>
                                            <p className="text-sm text-gray-500 mt-1">Use the Find Alternatives button to search for matching activities</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
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