import { useState } from "react";
import TestResultVisualCard from "../components/TestResultVisualCard";
import Modal from "../components/Modal";
import TestSelectionModal from "../components/TestSelectionModal";

const TestGroups = [
    {
        category: "Blood Tests",
        tests: [
            {
                name: "Hemoglobin",
                unit: "g/dL",
                id: "hemoglobin"
            },
            {
                name: "Hematocrit",
                unit: "%",
                id: "hematocrit"
            },

            
        ]
    },
    {
        category: "Urine Tests",
        tests: [
            {
                name: "Glucose",
                unit: "mg/dL",
                id: "glucose"
            },
            {
                name: "Protein",
                unit: "mg/dL",
                id: "protein"
            }  
        ]
    },
    {
        category: "Liver Function Tests",
        tests: [
            {
                name: "Alanine Aminotransferase",
                unit: "U/L",
                id: "alanineAminotransferase"
            },
            {
                name: "Aspartate Aminotransferase",
                unit: "U/L",
                id: "aspartateAminotransferase"
            }
        ]
    },
    {
        category: "Kidney Function Tests",
        tests: [
            {
                name: "Creatinine",
                unit: "mg/dL",
                id: "creatinine"
            },
            {
                name: "BUN",
                unit: "mg/dL",
                id: "bun"
            }
        ]
    }
]





export const TestResultsVisualizationPage = () => {
    type SelectedTest = {
        category: string;
        test: {
            name: string;
            unit: string;
            id: string;
        }
    }
    const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const testSelected = selectedTests.length > 0;

    const handleTestSelect = (category: string, test: SelectedTest['test']) => {
        setSelectedTests([...selectedTests, { category, test }]);
    };

    const handleTestRemove = (category: string, test: SelectedTest['test']) => {
        setSelectedTests(selectedTests.filter(
            st => !(st.category === category && st.test.id === test.id)
        ));
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            {
                selectedTests.map((group) => (
                    <section key={`${group.category}-${group.test.id}`} className="bg-[#111827] mb-12">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white">
                            <h2 className="text-lg font-semibold text-gray-900">{group.test.name}</h2>
                        </div>
                        <div className="pb-6 pt-3">
                            <TestResultVisualCard />
                        </div>
                    </section>
                ))
            }
            <div className="bg-[#141b2b] rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
                </div>
                <div className="p-6 w-full my-4 playground h-96 flex flex-col items-center justify-center">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300" 
                        onClick={handleOpenModal}
                    >
                        {testSelected ? "View more tests" : "Select tests to view"}
                    </button>
                </div>

                {/* Modal */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    title="Select Tests"
                >
                    <TestSelectionModal
                        testGroups={TestGroups}
                        onTestSelect={handleTestSelect}
                        onTestRemove={handleTestRemove}
                        selectedTests={selectedTests}
                    />
                </Modal>
            </div>
        </>
    )
}