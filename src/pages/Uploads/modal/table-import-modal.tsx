import React, { useState } from 'react';
import { X, Edit2, ChevronDown, Save, Trash2, Plus } from 'lucide-react';

// AddCardRoundedIcon replacement
const AddCardIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2zm-9 6h2v2h2v-2h2v-2h-2v-2h-2v2H9v2z" />
    </svg>
);

interface Column {
    id: string;
    name: string;
    dataType: string;
    length: number;
    isEditing: boolean;
}

interface TableImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadedFileName: string;
}

const TableImportModal = ({ isOpen, onClose, uploadedFileName }: TableImportModalProps) => {
    const [createNewTable, setCreateNewTable] = useState<'yes' | 'no'>('no');
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState<Column[]>([
        { id: '1', name: 'id', dataType: 'INT', length: 10, isEditing: false },
        { id: '2', name: 'Full Name', dataType: 'VARCHAR', length: 100, isEditing: false },
        { id: '3', name: 'Address', dataType: 'VARCHAR', length: 100, isEditing: false },
    ]);

    const handleEditClick = (id: string) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, isEditing: !col.isEditing } : col
        ));
    };

    const handleColumnChange = (id: string, field: keyof Column, value: string | number) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, [field]: value } : col
        ));
    };

    const handleAddColumn = () => {
        const newColumn: Column = {
            id: Date.now().toString(),
            name: '',
            dataType: 'VARCHAR',
            length: 100,
            isEditing: true
        };
        setColumns([...columns, newColumn]);
    };

    const handleDeleteColumn = (id: string) => {
        setColumns(columns.filter(col => col.id !== id));
    };

    const handleSave = (id: string) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, isEditing: false } : col
        ));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                style={{
                    width: 'calc(100vw - 200px)',
                    height: 'calc(100vh - 200px)',
                    margin: '100px'
                }}
            >

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    {/* Create New Table Section */}
                    <div className="mb-8">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">
                            Do you want to create new table?
                        </h4>
                        <div className="flex gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="createTable"
                                    value="yes"
                                    checked={createNewTable === 'yes'}
                                    onChange={() => setCreateNewTable('yes')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="createTable"
                                    value="no"
                                    checked={createNewTable === 'no'}
                                    onChange={() => setCreateNewTable('no')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">No</span>
                            </label>
                        </div>
                    </div>

                    {/* Select Existing Table Section - Only show when "No" is selected */}
                    {createNewTable === 'no' && (
                        <div className="mb-8">
                            <h4 className="text-base font-semibold text-gray-900 mb-4">
                                Select existed table
                            </h4>
                            <div className="relative">
                                <select
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                                >
                                    <option value="">Select Table</option>
                                    <option value="table1">Table 1</option>
                                    <option value="table2">Table 2</option>
                                    <option value="table3">Table 3</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Uploaded File Section - Only show when "Yes" is selected */}
                    {createNewTable === 'yes' && (
                        <div className="mb-8">
                            <h4 className="text-base font-semibold text-gray-900 mb-4">
                                Uploaded File
                            </h4>
                            <p className="text-sm text-gray-700">{uploadedFileName}</p>
                        </div>
                    )}

                    {/* Uploaded File Section */}
                    <div className="mb-8">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">
                            Uploaded File
                        </h4>
                        <p className="text-sm text-gray-700">{uploadedFileName}</p>
                    </div>

                    {/* Extracted Column Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-semibold text-gray-900">
                                Extracted Column
                            </h4>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200">
                                <div className="col-span-4 px-4 py-3">
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Column Name
                                    </span>
                                </div>
                                <div className="col-span-3 px-4 py-3">
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Data Type
                                    </span>
                                </div>
                                <div className="col-span-3 px-4 py-3">
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Length
                                    </span>
                                </div>
                                <div className="col-span-2 px-4 py-3 flex items-center gap-1">
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </span>
                                    <button
                                        onClick={handleAddColumn}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Add Row"
                                    >
                                        <AddCardIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Table Rows */}
                            {columns.map((column) => (
                                <div
                                    key={column.id}
                                    className="grid grid-cols-12 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="col-span-4 px-4 py-4">
                                        {column.isEditing ? (
                                            <input
                                                type="text"
                                                value={column.name}
                                                onChange={(e) => handleColumnChange(column.id, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Column name"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-700">{column.name}</span>
                                        )}
                                    </div>
                                    <div className="col-span-3 px-4 py-4">
                                        {column.isEditing ? (
                                            <select
                                                value={column.dataType}
                                                onChange={(e) => handleColumnChange(column.id, 'dataType', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="INT">INT</option>
                                                <option value="VARCHAR">VARCHAR</option>
                                                <option value="TEXT">TEXT</option>
                                                <option value="DATE">DATE</option>
                                                <option value="DATETIME">DATETIME</option>
                                                <option value="DECIMAL">DECIMAL</option>
                                                <option value="BOOLEAN">BOOLEAN</option>
                                            </select>
                                        ) : (
                                            <span className="text-sm text-gray-500">{column.dataType}</span>
                                        )}
                                    </div>
                                    <div className="col-span-3 px-4 py-4">
                                        {column.isEditing ? (
                                            <input
                                                type="number"
                                                value={column.length}
                                                onChange={(e) => handleColumnChange(column.id, 'length', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Length"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-500">{column.length}</span>
                                        )}
                                    </div>
                                    <div className="col-span-2 px-4 py-4 flex items-center gap-2">
                                        {column.isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleSave(column.id)}
                                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                                    title="Save"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(column.id)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            console.log('Next clicked', { columns, createNewTable, selectedTable });
                        }}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableImportModal;