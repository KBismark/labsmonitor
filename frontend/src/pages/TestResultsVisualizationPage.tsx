import { useContext, useState } from "react";
import TestResultVisualCard from "../components/TestResultVisualCard";
import Modal from "../components/Modal";
import TestSelectionModal from "../components/TestSelectionModal";
import { StoryBlokContext } from "../contexts/StoryBlokContext";


export const TestResultsVisualizationPage = () => {
    const { story } = useContext(StoryBlokContext);
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
                selectedTests.map((group) => (<TestResultVisualCard key={`${group.category}-${group.test.id}`} testData={group} /> ))
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
                        testGroups={story!}
                        onTestSelect={handleTestSelect}
                        onTestRemove={handleTestRemove}
                        selectedTests={selectedTests}
                    />
                </Modal>
            </div>
        </>
    )
}