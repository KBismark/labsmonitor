import { useState } from 'react';

interface Test {
    name: string;
    unit: string;
    id: string;
}

interface TestGroup {
    category: string;
    tests: Test[];
}

interface TestSelectionModalProps {
    testGroups: TestGroup[];
    onTestSelect: (category: string, test: Test) => void;
    onTestRemove: (category: string, test: Test) => void;
    selectedTests: Array<{ category: string; test: Test }>;
}

export default function TestSelectionModal({ 
    testGroups, 
    onTestSelect, 
    onTestRemove,
    selectedTests 
}: TestSelectionModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const isTestSelected = (category: string, testId: string) => {
        return selectedTests.some(st => st.category === category && st.test.id === testId);
    };

    const handleTestClick = (category: string, test: Test) => {
        if (isTestSelected(category, test.id)) {
            onTestRemove(category, test);
        } else {
            onTestSelect(category, test);
        }
    };

    return (
        <div className="space-y-6">
            {/* Category Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {testGroups.map((group) => (
                    <button
                        key={group.category}
                        onClick={() => setSelectedCategory(
                            selectedCategory === group.category ? null : group.category
                        )}
                        className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors duration-200 capitalize ${
                            selectedCategory === group.category
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {group.category}
                    </button>
                ))}
            </div>

            {/* Test Selection */}
            {selectedCategory && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {selectedCategory}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {testGroups
                            .find(group => group.category === selectedCategory)
                            ?.tests.map((test) => (
                                <button
                                    key={test.id}
                                    onClick={() => handleTestClick(selectedCategory, test)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                        isTestSelected(selectedCategory, test.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="font-medium text-sm text-gray-900">
                                        {test.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Unit: {test.unit}
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Selected Tests ({selectedTests.length})
                    </h3>
                    <div className="space-y-1">
                        {selectedTests.map((selectedTest, index) => (
                            <div
                                key={`${selectedTest.category}-${selectedTest.test.id}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <div className="font-medium text-sm text-gray-900">
                                        {selectedTest.test.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {selectedTest.category} • {selectedTest.test.unit}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onTestRemove(selectedTest.category, selectedTest.test)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 