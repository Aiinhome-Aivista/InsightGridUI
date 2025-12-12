import React, { useState, useEffect } from 'react';
import { X, Edit2, ChevronDown, Save, Trash2, Plus, Pencil, Loader2 } from 'lucide-react';
import ApiService from '../../../services/ApiServices';

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
    length: number | string;
    primary: boolean;
    isEditing: boolean;
}

interface ApiData {
    existing_tables: any[];
    file_name: string;
    file_size: string;
    new_table_schema: { column: string; datatype: string; length: string | number | null; primary: boolean }[];
    suggested_table_name: string;
    table_dropdown: any[];
}

interface TableImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadedFileName: string;
    apiData?: ApiData;
}

const TableImportModal = ({ isOpen, onClose, uploadedFileName, apiData }: TableImportModalProps) => {

    console.log("🔍 TableImportModal received apiData:", apiData);
    const [createNewTable, setCreateNewTable] = useState<'yes' | 'no'>('yes');
    const [selectedTable, setSelectedTable] = useState('');
    const [tableName, setTableName] = useState(uploadedFileName.replace(/\.[^/.]+$/, ''));
    const [isEditingTableName, setIsEditingTableName] = useState(false);
    const [tempTableName, setTempTableName] = useState('');
    const [step, setStep] = useState<'configure' | 'preview' | 'loading' | 'success'>('configure');
    const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
    const [columns, setColumns] = useState<Column[]>([]);
    const [previewRows, setPreviewRows] = useState<any[]>([]);
    //for session_id and created_by
    const [insertResponse, setInsertResponse] = useState<any>(null);



    const storedUser = JSON.parse(localStorage.getItem("ig_user") || "{}");

    const sessionId = storedUser?.session_id || "";
    const createdBy = storedUser?.user_id || "";

    useEffect(() => {
        if (isOpen && apiData) {
            setTableName(apiData.suggested_table_name || uploadedFileName.replace(/\.[^/.]+$/, ''));
        }
    }, [isOpen, apiData, uploadedFileName]);

    useEffect(() => {
        if (!apiData) return;

        if (createNewTable === 'yes') {
            const mappedColumns = (apiData.new_table_schema || []).map((col, index) => ({
                id: String(index),
                name: col.column,
                dataType: col.datatype,
                length: col.length ?? '',
                primary: col.primary || false,
                isEditing: false
            }));
            setColumns(mappedColumns);
        } else { // 'no'
            if (selectedTable) {
                const tableData = apiData.existing_tables.find(t => t.table_name === selectedTable);
                if (tableData && tableData.schema) {
                    const mappedColumns = tableData.schema.map((col: any, index: number) => ({
                        id: `${col.column}-${index}`,
                        name: col.column,
                        dataType: col.datatype,
                        length: col.length ?? '',
                        primary: col.primary || false,
                        isEditing: false,
                    }));
                    setColumns(mappedColumns);
                } else {
                    setColumns([]);
                }
            } else {
                setColumns([]);
            }
        }
    }, [createNewTable, selectedTable, apiData]);

    const handleEditClick = (id: string) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, isEditing: !col.isEditing } : col
        ));
    };

    const handleColumnChange = (id: string, field: keyof Column, value: any) => {
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
            primary: false,
            isEditing: true
        };
        setColumns([...columns, newColumn]);
    };

    const handleSave = (id: string) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, isEditing: false } : col
        ));
    };

    const handleEditTableName = () => {
        setTempTableName(tableName);
        setIsEditingTableName(true);
    };

    const handleSaveTableName = () => {
        if (tempTableName.trim()) {
            setTableName(tempTableName.trim());
        }
        setIsEditingTableName(false);
    };

    // const handleNext = async () => {

    //     // STEP 1 → CONFIGURE SCREEN: CALL PREVIEW API
    //     if (step === "configure") {

    //         // Build updated schema (JSON)
    //         const schema = columns.map(col => ({
    //             column: col.name,
    //             datatype: col.dataType,
    //             length: col.length,
    //             primary: col.primary
    //         }));

    //         // Build JSON payload
    //         const payload = {
    //             action: "preview",
    //             session_id: sessionId,      // from localStorage
    //             created_by: createdBy,      // from localStorage
    //             table_name: tableName,
    //             file_name: apiData?.file_name,
    //             schema: schema,             // FULL JSON ARRAY
    //             is_existing: createNewTable === "no"
    //         };

    //         console.log("Sending preview JSON payload:", payload);

    //         // try {
    //         //     // CALL JSON API (NOT form-data API)
    //         //     const response = await ApiService.preview(payload);
    //         //     console.log(" Preview Response:", response.data);

    //         //     // Example: If backend returns preview sample rows
    //         //     // setPreviewData(response.data.data);

    //         // } catch (err) {
    //         //     console.error(" Preview API Error:", err);
    //         // }

    //         try {
    //             const response = await ApiService.preview(payload);
    //             console.log("📥 Preview Response:", response.data);

    //             // 🔥 STORE PREVIEW ROWS FROM BACKEND
    //             const rows = response?.data?.data?.preview_rows || [];
    //             setPreviewRows(rows);

    //         } catch (err) {
    //             console.error("❌ Preview API Error:", err);
    //         }


    //         // Move to Preview UI
    //         setSlideDirection("left");
    //         setTimeout(() => {
    //             setStep("preview");
    //             setSlideDirection("right");
    //             setTimeout(() => setSlideDirection("none"), 50);
    //         }, 300);

    //         return;
    //     }

    //     // STEP 2 → PREVIEW SCREEN → loading → success
    //     if (step === "preview") {
    //         setSlideDirection("left");

    //         setTimeout(() => {
    //             setStep("loading");
    //             setSlideDirection("none");

    //             setTimeout(() => {
    //                 setStep("success");
    //             }, 1000);
    //         }, 300);

    //         return;
    //     }
    // };

    const handleNext = async () => {

        // STEP 1 → CONFIGURE SCREEN (Preview)
        if (step === "configure") {

            const schema = columns.map(col => ({
                column: col.name,
                datatype: col.dataType,
                length: col.length,
                primary: col.primary
            }));

            const previewPayload = {
                action: "preview",
                session_id: sessionId,
                created_by: createdBy,
                table_name: createNewTable === 'no' ? selectedTable : tableName,
                file_name: apiData?.file_name,
                schema: schema,
                is_existing: createNewTable === "no"
            };

            console.log("📤 Sending preview payload:", previewPayload);

            try {
                const response = await ApiService.preview(previewPayload);
                console.log("📥 Preview Response:", response.data);

                setPreviewRows(response?.data?.data?.preview_rows || []);

            } catch (err) {
                console.error("❌ Preview API Error:", err);
            }

            setSlideDirection("left");
            setTimeout(() => {
                setStep("preview");
                setSlideDirection("right");
                setTimeout(() => setSlideDirection("none"), 50);
            }, 300);

            return;
        }

        // STEP 2 → PREVIEW SCREEN (Insert Data)
        if (step === "preview") {

            setStep("loading");

            const schema = columns.map(col => ({
                column: col.name,
                datatype: col.dataType,
                length: col.length,
                primary: col.primary
            }));

            const insertPayload = {
                action: "insert_data",
                session_id: sessionId,
                created_by: createdBy,
                file_name: apiData?.file_name,
                table_name: createNewTable === 'no' ? selectedTable : tableName,
                is_existing: createNewTable === "no",
                schema: schema
            };

            console.log("📤 Sending insert_data payload:", insertPayload);

            try {
                const response = await ApiService.preview(insertPayload);
                console.log("📥 Insert Response:", response.data);

                setInsertResponse(response?.data?.data);
            } catch (err) {
                console.error("❌ Insert API Error:", err);
            }

            setTimeout(() => {
                setStep("success");
            }, 800);

            return;
        }
    };



    const handleBack = () => {
        if (step === 'success') {
            setSlideDirection('right');
            setTimeout(() => {
                setStep('preview');
                setSlideDirection('left');
                setTimeout(() => {
                    setSlideDirection('none');
                }, 50);
            }, 300);
        } else if (step === 'preview') {
            setSlideDirection('right');
            setTimeout(() => {
                setStep('configure');
                setSlideDirection('left');
                setTimeout(() => {
                    setSlideDirection('none');
                }, 50);
            }, 300);
        }
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
                <div className="p-12 overflow-y-auto flex-1">
                    <div className={`transition-all duration-300 ${slideDirection === 'left' ? '-translate-x-full opacity-0' :
                        slideDirection === 'right' ? 'translate-x-full opacity-0' :
                            'translate-x-0 opacity-100'
                        }`}>
                        {step === 'configure' ? (
                            <>
                                {/* Create New Table Section */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Do you want to create new table?
                                    </h4>
                                    <div className="flex gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="createTable"
                                                value="yes"
                                                checked={createNewTable === 'yes'}
                                                onChange={() => setCreateNewTable('yes')}
                                                className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 text-xs text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="createTable"
                                                value="no"
                                                checked={createNewTable === 'no'}
                                                onChange={() => setCreateNewTable('no')}
                                                className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 text-xs text-gray-700">No</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Select Existing Table Section - Only show when "No" is selected */}
                                {createNewTable === 'no' && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                            Select existed table
                                        </h4>
                                        <div className="relative">
                                            <select
                                                value={selectedTable}
                                                onChange={(e) => setSelectedTable(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 border-opacity-30 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-700"
                                            >
                                                <option value="">Select Table</option>
                                                {apiData?.existing_tables?.map((table: any, index: number) => (
                                                    <option key={index} value={table.table_name}>
                                                        {table.table_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                )}

                                {/* Uploaded File Section */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Uploaded File - {uploadedFileName}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                        {createNewTable === 'yes' && (
                                            <div className="flex items-center">
                                                {isEditingTableName ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={tempTableName}
                                                            onChange={(e) => setTempTableName(e.target.value)}
                                                            className="text-xs text-gray-700 border border-gray-300 border-opacity-30 rounded px-2 py-1 flex-1"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={handleSaveTableName}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Save table name"
                                                        >
                                                            <Save className="w-4 h-4 text-green-600" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-xs text-gray-700 font-medium flex-1">{tableName}</p>
                                                        <button
                                                            onClick={handleEditTableName}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit table name"
                                                        >
                                                            <Pencil className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Extracted Column Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-semibold text-gray-900">
                                            Extracted Column
                                        </h4>
                                    </div>
                                    <div className="rounded-lg overflow-hidden">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200">
                                            <div className={`${createNewTable === 'yes' ? 'col-span-3' : 'col-span-4'} px-3 py-2`}>
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Column Name
                                                </span>
                                            </div>
                                            <div className={`${createNewTable === 'yes' ? 'col-span-2' : 'col-span-3'} px-3 py-2`}>
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Data Type
                                                </span>
                                            </div>
                                            <div className={`${createNewTable === 'yes' ? 'col-span-2' : 'col-span-3'} px-3 py-2`}>
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Length
                                                </span>
                                            </div>
                                            <div className="col-span-2 px-3 py-2">
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Primary Key
                                                </span>
                                            </div>
                                            {createNewTable === 'yes' && (
                                                <div className="col-span-3 px-3 py-2 flex items-center gap-1">
                                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Action
                                                    </span>
                                                    <button
                                                        onClick={handleAddColumn}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Add Row"
                                                    >
                                                        <AddCardIcon className="w-3.5 h-3.5 text-[#3D5B81]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Table Rows */}
                                        {columns.map((column) => (
                                            <div
                                                key={column.id}
                                                className="grid grid-cols-12 border-b border-gray-200 border-opacity-30 last:border-b-0 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className={`${createNewTable === 'yes' ? 'col-span-3' : 'col-span-4'} px-3 py-2.5`}>
                                                    {column.isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={column.name}
                                                            onChange={(e) => handleColumnChange(column.id, 'name', e.target.value)}
                                                            className="w-full px-2 py-1.5 border border-gray-300 border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                            placeholder="Column name"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-700">{column.name}</span>
                                                    )}
                                                </div>
                                                <div className={`${createNewTable === 'yes' ? 'col-span-2' : 'col-span-3'} px-3 py-2.5`}>
                                                    {column.isEditing ? (
                                                        <select
                                                            value={column.dataType}
                                                            onChange={(e) => handleColumnChange(column.id, 'dataType', e.target.value)}
                                                            className="w-full px-2 py-1.5 border border-gray-300 border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
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
                                                        <span className="text-xs text-gray-500">{column.dataType}</span>
                                                    )}
                                                </div>
                                                <div className={`${createNewTable === 'yes' ? 'col-span-2' : 'col-span-3'} px-3 py-2.5`}>
                                                    {column.isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={column.length}
                                                            onChange={(e) => handleColumnChange(column.id, 'length', e.target.value)}
                                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                            placeholder="Length"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-500">{column.length}</span>
                                                    )}
                                                </div>
                                                <div className="col-span-2 px-3 py-2.5 flex items-center justify-center">
                                                    {column.isEditing ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={column.primary}
                                                            onChange={(e) => handleColumnChange(column.id, 'primary', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={column.primary}
                                                            disabled
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-not-allowed"
                                                        />
                                                    )}
                                                </div>
                                                {createNewTable === 'yes' && (
                                                    <div className="col-span-3 px-3 py-2.5 flex items-center gap-2">
                                                        {column.isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleSave(column.id)}
                                                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                                                    title="Save"
                                                                >
                                                                    <Save className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditClick(column.id)}
                                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* <div className="mt-8">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Insert Data
                                    </h4>
                                    <div className="flex gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="insertData"
                                                value="yes"
                                                className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 text-xs text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="insertData"
                                                value="no"
                                                className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 text-xs text-gray-700">No</span>
                                        </label>
                                    </div>
                                </div> */}
                            </>
                        ) : step === 'preview' ? (
                            <>
                                {/* Uploaded File Section - Same as before */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Uploaded File - {uploadedFileName}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                        {createNewTable === 'yes' && (
                                            <div className="flex items-center">
                                                <p className="text-xs text-gray-700 font-medium flex-1">{tableName}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Column Preview Table */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-semibold text-gray-900">
                                            Column Preview (Showing 5 out of 10,000)
                                        </h4>
                                    </div>
                                    <div className="rounded-lg overflow-hidden">
                                        {/* Table Header */}
                                        <div className="grid bg-gray-50 border-b border-gray-200 border-opacity-30" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
                                            {columns.map((column) => (
                                                <div key={column.id} className="px-3 py-2 border-r border-gray-200 border-opacity-30 last:border-r-0">
                                                    <span className="text-xs font-semibold text-[#3D5B81] uppercase tracking-wider">
                                                        {column.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* REAL PREVIEW DATA FROM BACKEND */}
                                        {previewRows.length > 0 ? (
                                            previewRows.map((row, rowIndex) => (
                                                <div
                                                    key={rowIndex}
                                                    className="grid border-b border-gray-200 border-opacity-30 last:border-b-0 hover:bg-gray-50 transition-colors"
                                                    style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}
                                                >
                                                    {columns.map((column) => (
                                                        <div
                                                            key={column.id}
                                                            className="px-3 py-2.5 border-r border-gray-200 border-opacity-30 last:border-r-0"
                                                        >
                                                            <span className="text-xs text-[#3D5B81]">
                                                                {String(row[column.name]) ?? ""}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500 p-4">
                                                No preview data available.
                                            </p>
                                        )}

                                    </div>
                                </div>
                            </>
                        ) : step === 'loading' ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <p className="text-sm text-gray-600">Creating table...</p>
                            </div>
                        ) : (
                            <>
                                {/* Success State */}
                                <div className="flex flex-col h-full">
                                    {/* <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>

                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {insertResponse?.summary_message
                                                    ? insertResponse.summary_message
                                                    : `Table "${tableName}" created successfully`}
                                            </h4>

                                        </div>
                                    </div> */}

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            {insertResponse?.summary_message
                                                ? insertResponse.summary_message
                                                : `Table "${tableName}" created successfully`}
                                        </h4>

                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    {(step === 'preview' || step === 'success') && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-xs"
                        >
                            Back
                        </button>
                    )}
                    {step === 'success' ? (
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs"
                        >
                            Finish
                        </button>
                    ) : step !== 'loading' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs"
                            >
                                Next
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableImportModal;