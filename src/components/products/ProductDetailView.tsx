import { useState, useEffect } from 'react';
import { Product, Impact } from '@/interfaces/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BarChart3, 
  Table as TableIcon, 
  ChevronDown, 
  Info, 
  PieChart,
  Thermometer,
  Droplet,
  Wind,
  Leaf
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
}

// Define material item interface with optional details
interface MaterialItem {
  name: string;
  share: number;
  displayShare?: number;
  value: number;
  unit: string;
  quantity: number;
  materialUnit: string;
  activityName: string;
  transformationActivityName: string;
  details?: MaterialItem[];
}

// Define available impact methods with icons
const impactMethods = [
  { method: 'acidification', name: 'Acidification', unit: 'mol H+-Eq', icon: <Droplet className="h-4 w-4" /> },
  { method: 'climate change', name: 'Climate Change', unit: 'kg CO2-Eq', icon: <Thermometer className="h-4 w-4" /> },
  { method: 'ecotoxicity: freshwater', name: 'Freshwater Ecotoxicity', unit: 'CTUe', icon: <Droplet className="h-4 w-4" /> },
  { method: 'eutrophication: freshwater', name: 'Freshwater Eutrophication', unit: 'kg P-Eq', icon: <Droplet className="h-4 w-4" /> },
  { method: 'eutrophication: marine', name: 'Marine Eutrophication', unit: 'kg N-Eq', icon: <Droplet className="h-4 w-4" /> },
  { method: 'eutrophication: terrestrial', name: 'Terrestrial Eutrophication', unit: 'mol N-Eq', icon: <Leaf className="h-4 w-4" /> },
  { method: 'human toxicity: carcinogenic', name: 'Human Toxicity (Cancer)', unit: 'CTUh', icon: <Thermometer className="h-4 w-4" /> },
  { method: 'human toxicity: non-carcinogenic', name: 'Human Toxicity (Non-Cancer)', unit: 'CTUh', icon: <Thermometer className="h-4 w-4" /> },
  { method: 'ionising radiation: human health', name: 'Ionising Radiation', unit: 'kBq U235-Eq', icon: <Thermometer className="h-4 w-4" /> },
  { method: 'land use', name: 'Land Use', unit: 'dimensionless', icon: <Leaf className="h-4 w-4" /> },
  { method: 'ozone depletion', name: 'Ozone Depletion', unit: 'kg CFC-11-Eq', icon: <Wind className="h-4 w-4" /> },
  { method: 'particulate matter formation', name: 'Particulate Matter', unit: 'disease incidence', icon: <Wind className="h-4 w-4" /> },
  { method: 'photochemical oxidant formation: human health', name: 'Photochemical Ozone Formation', unit: 'kg NMVOC-Eq', icon: <Wind className="h-4 w-4" /> },
  { method: 'energy resources: non-renewable', name: 'Non-Renewable Energy Use', unit: 'MJ, net calorific value', icon: <PieChart className="h-4 w-4" /> },
  { method: 'material resources: metals/minerals', name: 'Mineral Resource Use', unit: 'kg Sb-Eq', icon: <PieChart className="h-4 w-4" /> },
  { method: 'water use', name: 'Water Scarcity', unit: 'm3 world Eq deprived', icon: <Droplet className="h-4 w-4" /> },
];

// Threshold for grouping materials into "Others" category (in percentage)
const OTHERS_THRESHOLD = 1;

export function ProductDetailView({ product, onBack }: ProductDetailViewProps) {
  const { displayedImpact, setDisplayedImpact } = useStore();
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showOthersTooltip, setShowOthersTooltip] = useState(false);
  
  // Select the first impact method by default if none is selected
  useEffect(() => {
    if (!displayedImpact && product.summary?.impacts && product.summary.impacts.length > 0) {
      const firstMethod = product.summary.impacts[0];
      const methodInfo = impactMethods.find(m => m.method === firstMethod.method);
      if (methodInfo) {
        setDisplayedImpact({ method: methodInfo.method, unit: methodInfo.unit });
      }
    }
  }, [product, displayedImpact, setDisplayedImpact]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMethodDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Calculate chart data
  const getChartData = (): MaterialItem[] => {
    if (!displayedImpact || !product.productMaterials) return [];

    const rawData: MaterialItem[] = product.productMaterials
      .filter(material => material.impacts)
      .map(material => {
        // Check if we have the new structure with impacts or the old structure
        const hasNewStructure = 'impacts' in (material.impacts || {});
        
        let impact;
        if (hasNewStructure) {
          // @ts-expect-error - New structure
          impact = material.impacts?.impacts?.find(
            (i: Impact) => i.method === displayedImpact.method
          );
        } else {
          // Old structure
          const mainImpact = material.impacts?.mainActivityImpacts?.find(
            (i: Impact) => i.method === displayedImpact.method
          );
          
          const transformImpact = material.impacts?.transformationActivityImpacts?.find(
            (i: Impact) => i.method === displayedImpact.method
          );
          
          if (mainImpact || transformImpact) {
            impact = {
              method: displayedImpact.method,
              value: (mainImpact?.value || 0) + (transformImpact?.value || 0),
              unit: mainImpact?.unit || transformImpact?.unit || '',
              share: (mainImpact?.share || 0) + (transformImpact?.share || 0),
              version: mainImpact?.version || transformImpact?.version || '',
              activityType: 'combined'
            };
          }
        }
        
        return {
          name: material.material.name,
          share: impact?.share ?? 0,
          value: impact?.value ?? 0,
          unit: impact?.unit || '',
          quantity: material.quantity,
          materialUnit: material.unit,
          activityName: material.activityName || '',
          transformationActivityName: material.transformationActivityName || '',
        };
      })
      .sort((a, b) => b.share - a.share);

    // Separate significant materials from insignificant ones
    const significantMaterials = rawData.filter(item => item.share >= OTHERS_THRESHOLD);
    const insignificantMaterials = rawData.filter(item => item.share < OTHERS_THRESHOLD);

    // If there are insignificant materials, create an "Others" category
    if (insignificantMaterials.length > 0) {
      const othersShare = insignificantMaterials.reduce((sum, item) => sum + item.share, 0);
      const othersValue = insignificantMaterials.reduce((sum, item) => sum + item.value, 0);
      const unit = insignificantMaterials[0]?.unit || '';

      // Add "Others" category to the significant materials
      significantMaterials.push({
        name: 'Others',
        share: othersShare,
        value: othersValue,
        unit,
        quantity: 0,
        materialUnit: '',
        activityName: '',
        transformationActivityName: '',
        details: insignificantMaterials // Store the details for tooltip
      });
    }

    // Sort by share in descending order
    const sortedMaterials = significantMaterials.sort((a, b) => b.share - a.share);
    
    // Normalize percentages to ensure they sum to 100%
    const totalShare = sortedMaterials.reduce((sum, item) => sum + item.share, 0);
    
    // Only normalize if the total is not already 100% (with a small margin for floating point errors)
    if (Math.abs(totalShare - 100) > 0.01) {
      sortedMaterials.forEach(item => {
        item.share = (item.share / totalShare) * 100;
      });
    }
    
    // Round very small percentages to 0 for display purposes
    sortedMaterials.forEach(item => {
      if (item.share < 1) {
        item.displayShare = 0;
      } else {
        item.displayShare = Math.round(item.share);
      }
    });
    
    return sortedMaterials;
  };

  const chartData = getChartData();
  
  // Find the currently selected impact in the product summary
  const currentImpactSummary = product.summary?.impacts.find(
    impact => impact.method === displayedImpact?.method
  );

  // Find the name and icon of the currently selected impact method
  const currentMethod = impactMethods.find(
    m => m.method === displayedImpact?.method
  );
  const currentMethodName = currentMethod?.name || 'Select a method';
  const currentMethodIcon = currentMethod?.icon;

  // Handle mouse events for Others tooltip
  const handleOthersMouseEnter = () => {
    setShowOthersTooltip(true);
  };

  const handleOthersMouseLeave = () => {
    setShowOthersTooltip(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Button>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Badge variant="outline" className="ml-2">
            {product.reference}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Materials analysis</h2>
            <div className="flex bg-black text-white rounded-full overflow-hidden">
              <button 
                className={`px-4 py-2 flex items-center ${viewMode === 'graph' ? 'bg-black' : 'bg-gray-700'}`}
                onClick={() => setViewMode('graph')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Graph
              </button>
              <button 
                className={`px-4 py-2 flex items-center ${viewMode === 'table' ? 'bg-black' : 'bg-gray-700'}`}
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4 mr-2" />
                Table
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Impact Method</h3>
            <div className="relative">
              <button 
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md border border-gray-300 text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMethodDropdown(!showMethodDropdown);
                }}
              >
                <span className="flex items-center">
                  {currentMethodIcon && <span className="mr-2">{currentMethodIcon}</span>}
                  {currentMethodName}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showMethodDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  {impactMethods.map((method) => {
                    const isAvailable = product.summary?.impacts.some(impact => impact.method === method.method);
                    const isSelected = displayedImpact?.method === method.method;
                    
                    return (
                      <button
                        key={method.method}
                        disabled={!isAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDisplayedImpact({ method: method.method, unit: method.unit });
                          setShowMethodDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 flex items-center ${
                          isSelected 
                            ? 'bg-black text-white' 
                            : 'hover:bg-gray-100'
                        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="mr-2">{method.icon}</span>
                        {method.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {currentImpactSummary && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total impact - {currentMethodName}</h3>
                <p className="text-2xl font-bold">
                  {Math.round(currentImpactSummary.value).toLocaleString()} {currentImpactSummary.unit}
                </p>
              </div>
            </div>
          )}

          {viewMode === 'graph' && chartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Impact distribution by material</h3>
              
              <div className="mt-8">
                {/* Material names and percentages at the top */}
                <div className="flex mb-4">
                  {chartData.map((item, index) => (
                    <div 
                      key={`header-${index}`} 
                      className="flex-1 text-center px-2"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium truncate">{item.name}</span>
                          {item.name === 'Others' && item.details && (
                            <div 
                              className="ml-1 cursor-help relative"
                              onMouseEnter={handleOthersMouseEnter}
                              onMouseLeave={handleOthersMouseLeave}
                            >
                              <Info size={14} className="text-gray-500" />
                              
                              {showOthersTooltip && (
                                <div className="absolute bottom-full right-0 mb-2 p-3 bg-black text-white rounded-md shadow-lg z-50 w-64">
                                  <h4 className="font-bold mb-2">Other materials</h4>
                                  <div className="max-h-60 overflow-y-auto">
                                    {item.details.map((detail, i) => (
                                      <div key={i} className="mb-2">
                                        <div className="flex justify-between">
                                          <span>{detail.name}</span>
                                          <span>{detail.share < 1 ? '< 1%' : `${Math.round(detail.share)}%`}</span>
                                        </div>
                                        <div className="text-xs text-gray-300">
                                          {Math.round(detail.value).toLocaleString()} {detail.unit}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="absolute right-4 -bottom-2 w-3 h-3 bg-black rotate-45"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold">{item.displayShare}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Vertical bars */}
                <div className="flex h-[300px] items-end mb-4">
                  {chartData.map((item, index) => {
                    // Calculate bar height based on percentage, with minimum height for visibility
                    const barHeight = item.share > 0 
                      ? Math.max((item.share / 100) * 300, 5)
                      : 5;
                    
                    return (
                      <div 
                        key={`bar-${index}`} 
                        className="flex-1 flex items-end justify-center px-2"
                      >
                        <div 
                          className={`rounded-md relative w-full ${
                            item.name === 'Others' ? 'bg-gray-400' : 'bg-[#6B5CA5]'
                          }`}
                          style={{
                            height: `${barHeight}px`,
                          }}
                        >
                          {item.share >= 5 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                              {item.displayShare}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Values at the bottom */}
                <div className="flex">
                  {chartData.map((item, index) => (
                    <div 
                      key={`value-${index}`} 
                      className="flex-1 text-center px-2"
                    >
                      <div className="text-xs text-gray-500">
                        {Math.round(item.value).toLocaleString()} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'table' && chartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Impact details by material</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Material</th>
                      <th className="text-right py-2 px-4">Share (%)</th>
                      <th className="text-right py-2 px-4">Value</th>
                      <th className="text-right py-2 px-4">Quantity</th>
                      <th className="text-left py-2 px-4">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {item.name}
                            {item.name === 'Others' && item.details && (
                              <div 
                                className="ml-1 cursor-help relative"
                                onMouseEnter={handleOthersMouseEnter}
                                onMouseLeave={handleOthersMouseLeave}
                              >
                                <Info size={16} className="text-gray-500" />
                                
                                {showOthersTooltip && (
                                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-black text-white rounded-md shadow-lg z-50 w-64">
                                    <h4 className="font-bold mb-2">Other materials</h4>
                                    <div className="max-h-60 overflow-y-auto">
                                      {item.details.map((detail, i) => (
                                        <div key={i} className="mb-2">
                                          <div className="flex justify-between">
                                            <span>{detail.name}</span>
                                            <span>{detail.share.toFixed(1)}%</span>
                                          </div>
                                          <div className="text-xs text-gray-300">
                                            {Math.round(detail.value).toLocaleString()} {detail.unit}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="absolute left-4 -bottom-2 w-3 h-3 bg-black rotate-45"></div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-2 px-4">{Math.round(item.share)}%</td>
                        <td className="text-right py-2 px-4">
                          {Math.round(item.value).toLocaleString()} {item.unit}
                        </td>
                        <td className="text-right py-2 px-4">
                          {item.name !== 'Others' ? `${item.quantity} ${item.materialUnit}` : '-'}
                        </td>
                        <td className="py-2 px-4">
                          {item.name !== 'Others' && (
                            <div className="text-sm">
                              {item.activityName}
                              {item.transformationActivityName && item.transformationActivityName !== "NA" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Transformation: {item.transformationActivityName}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 