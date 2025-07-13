import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TestRecord {
  date: string;
  testType: string;
  value: number;
  unit: string;
  minRange?: number;
  maxRange?: number;
}

const AddTestRecord = () => {
  const [selectedPanel, setSelectedPanel] = useState('');
  const [testRecords, setTestRecords] = useState<TestRecord[]>([]);

  const testPanels = {
    'CBC': ['RBC', 'HB', 'PLATELETS', 'WBC'],
    'KFT': ['POTASSIUM', 'UREA', 'CREATININE', 'eGFR'],
    'LFT': ['ALT', 'AST', 'ALP', 'GGT', 'T-BIL', 'D-BIL', 'TOTAL PROTEIN', 'ALBUMIN'],
    'LIPID': ['T. CHOL', 'HDL', 'LDL', 'TRIG', 'NON-HDL CHOL'],
    'GLUCOSE': ['GLUCOSE', 'HBA1C', 'INSULIN', 'LACTATE'],
    'IRON': ['IRON', 'TRANSFERRI', 'FERRITIN', 'IRON SATURATION'],
    'FLUID': ['PROTEIN', 'GLUCOSE', 'LDH'],
    'CARDIAC': ['CPK', 'AST', 'LDH', 'CKMB'],
    'TROPININS': ['T. I', 'T. T'],
    'THYROID': ['TSH', 'T3', 'T4'],
    'URINE': ['PROTEIN', 'BLOOD', 'BACTERIA', 'SG', 'GLUCOSE'],
    'FERTILITY': ['FSH', 'LH', 'PROLACTIN', 'ESTROGEN', 'PROGESTERONE', 'AMH', 'TESTOSTERONE'],
    'ELECTROLYTES': ['SODIUM', 'POTASSIUM', 'CHLORIDE'],
    'SEMEN': ['Sperm concentration', 'Motility', 'Sperm count', 'Viability'],
    'ACR': ['Albumin', 'Creatinine', 'Ratio'],
    'URINE_PROTEIN': ['URINE CREATININE', 'URINE PROTEIN', 'RATIO']
  };

  const getTestUnit = (testName: string) => {
    const units: { [key: string]: string } = {
      'RBC': 'million/μL',
      'HB': 'g/dL',
      'PLATELETS': 'thousand/μL',
      'WBC': 'thousand/μL',
      'POTASSIUM': 'mEq/L',
      'UREA': 'mg/dL',
      'CREATININE': 'mg/dL',
      'eGFR': 'mL/min/1.73m²',
      'ALT': 'U/L',
      'AST': 'U/L',
      'ALP': 'U/L',
      'GGT': 'U/L',
      'T-BIL': 'mg/dL',
      'D-BIL': 'mg/dL',
      'TOTAL PROTEIN': 'g/dL',
      'ALBUMIN': 'g/dL',
      'T. CHOL': 'mg/dL',
      'HDL': 'mg/dL',
      'LDL': 'mg/dL',
      'TRIG': 'mg/dL',
      'NON-HDL CHOL': 'mg/dL',
      'GLUCOSE': 'mg/dL',
      'HBA1C': '%',
      'INSULIN': 'μIU/mL',
      'LACTATE': 'mmol/L',
      'IRON': 'μg/dL',
      'TRANSFERRI': 'mg/dL',
      'FERRITIN': 'ng/mL',
      'IRON SATURATION': '%',
      'PROTEIN': 'g/dL',
      'LDH': 'U/L',
      'CPK': 'U/L',
      'CKMB': 'ng/mL',
      'T. I': 'ng/mL',
      'T. T': 'ng/mL',
      'TSH': 'μIU/mL',
      'T3': 'ng/dL',
      'T4': 'μg/dL',
      'BLOOD': 'cells/hpf',
      'BACTERIA': 'per hpf',
      'SG': '',
      'FSH': 'mIU/mL',
      'LH': 'mIU/mL',
      'PROLACTIN': 'ng/mL',
      'ESTROGEN': 'pg/mL',
      'PROGESTERONE': 'ng/mL',
      'AMH': 'ng/mL',
      'TESTOSTERONE': 'ng/dL',
      'SODIUM': 'mEq/L',
      'CHLORIDE': 'mEq/L',
      'Sperm concentration': 'million/mL',
      'Motility': '%',
      'Sperm count': 'million',
      'Viability': '%',
      'Albumin': 'mg/g',
      'Ratio': '',
      'URINE CREATININE': 'mg/dL',
      'URINE PROTEIN': 'mg/dL'
    };
    return units[testName] || '';
  };

  const addTestRow = () => {
    if (!selectedPanel) {
      toast.error('Please select a test panel first');
      return;
    }

    const newRecord: TestRecord = {
      date: new Date().toISOString().split('T')[0],
      testType: testPanels[selectedPanel as keyof typeof testPanels][0],
      value: 0,
      unit: getTestUnit(testPanels[selectedPanel as keyof typeof testPanels][0])
    };

    setTestRecords([...testRecords, newRecord]);
  };

  const removeTestRow = (index: number) => {
    setTestRecords(testRecords.filter((_, i) => i !== index));
  };

  const updateTestRecord = (index: number, field: keyof TestRecord, value: any) => {
    const updated = [...testRecords];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'testType') {
      updated[index].unit = getTestUnit(value);
    }
    
    setTestRecords(updated);
  };

  const saveRecords = async () => {
    if (testRecords.length === 0) {
      toast.error('Please add at least one test record');
      return;
    }

    try {
      // TODO: Implement API call to save records
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Test records saved successfully!');
      setTestRecords([]);
      setSelectedPanel('');
    } catch{
      toast.error('Failed to save test records');
    }
  };

  const cancelRecords = () => {
    setTestRecords([]);
    setSelectedPanel('');
    toast.success('Changes discarded');
  };

  return (
    <div className="space-y-6">
      {/* Panel Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Test Panel
        </label>
        <select
          value={selectedPanel}
          onChange={(e) => setSelectedPanel(e.target.value)}
          className="w-full md:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a test panel...</option>
          {Object.keys(testPanels).map((panel) => (
            <option key={panel} value={panel}>
              {panel.replace('_', ' ')} Panel
            </option>
          ))}
        </select>
      </div>

      

      {/* Test Records Table */}
      {testRecords.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="date"
                          value={record.date}
                          onChange={(e) => updateTestRecord(index, 'date', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={record.testType}
                        onChange={(e) => updateTestRecord(index, 'testType', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {selectedPanel && testPanels[selectedPanel as keyof typeof testPanels].map((test) => (
                          <option key={test} value={test}>
                            {test}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={record.value}
                        onChange={(e) => updateTestRecord(index, 'value', parseFloat(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={record.minRange || ''}
                        onChange={(e) => updateTestRecord(index, 'minRange', parseFloat(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                        placeholder="Min"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={record.maxRange || ''}
                        onChange={(e) => updateTestRecord(index, 'maxRange', parseFloat(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                        placeholder="Max"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removeTestRow(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Test Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={addTestRow}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className='sm:block hidden'>Add Test Record</span>
          <span className='sm:hidden'>Add</span>
        </button>

        {testRecords.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={saveRecords}
              className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <span className='sm:block hidden'>Save Records</span>
              <span className='sm:hidden'>Save</span>
            </button>
            <button
              onClick={cancelRecords}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Select a test panel from the dropdown above</li>
          <li>2. Click "Add Test Record" to add rows for entering test results</li>
          <li>3. Fill in the date, test type, value, and optional min/max ranges</li>
          <li>4. Click "Save Records" to store your data or "Cancel" to discard changes</li>
        </ul>
      </div>
    </div>
  );
};

export default AddTestRecord;