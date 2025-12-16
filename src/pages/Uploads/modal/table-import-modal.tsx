import React, { useState, useEffect } from 'react';
import { X, Edit2, ChevronDown, Save, Trash2, Plus, Pencil, Loader2 } from 'lucide-react';
import ApiService from '../../../services/ApiServices';

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
    onFinish?: () => void;
    uploadedFileName: string;
    apiData?: ApiData;
}

const TableImportModal = ({ isOpen, onClose, onFinish, uploadedFileName, apiData }: TableImportModalProps) => {

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
    const [insertData, setInsertData] = useState<"yes" | "no" | "">("");
    const [totalRows, settotalRows] = useState("");
    const [isSchemaMismatch, setIsSchemaMismatch] = useState(false);
    const [schemaMismatchData, setSchemaMismatchData] = useState(null);
    const [createTableResponse, setCreateTableResponse] = useState<any>(null);
    const [insertResponse, setInsertResponse] = useState<any>(null);
    const [treatFirstRowAsHeader, setTreatFirstRowAsHeader] = useState(true);

    // Pagination state for Extracted Columns table
    const [currentPage, setCurrentPage] = useState(1);
    const [pageWindowStart, setPageWindowStart] = useState(1);
    const rowsPerPage = 5;
    const maxVisiblePages = 5;

    const storedUser = JSON.parse(localStorage.getItem("ig_user") || "{}");
    const sessionId = storedUser?.session_id || "";
    const createdBy = storedUser?.user_id || "";

    // Calculate pagination values
    const totalRecords = columns.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
    const paginatedColumns = columns.slice(startIndex, endIndex);

    // Reset pagination when columns change
    useEffect(() => {
        setCurrentPage(1);
        setPageWindowStart(1);
    }, [columns.length]);

    // Handle page change
    const onPageChange = (page: number) => {
        setCurrentPage(page);

        // Adjust sliding window
        if (page > pageWindowStart + maxVisiblePages - 1) {
            setPageWindowStart(page - maxVisiblePages + 1);
        } else if (page < pageWindowStart) {
            setPageWindowStart(page);
        }
    };

    // Handle Previous button
    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // Handle Next button
    const onNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Generate visible page numbers
    const getVisiblePages = () => {
        const pages = [];
        const endPage = Math.min(pageWindowStart + maxVisiblePages - 1, totalPages);

        for (let i = pageWindowStart; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    useEffect(() => {
        if (step === "preview") {
            setInsertData("");
        }
    }, [step]);

    useEffect(() => {
        if (isOpen && apiData) {
            setTableName(apiData.suggested_table_name || uploadedFileName.replace(/\.[^/.]+$/, ''));
        }
        setStep("configure");
        setTreatFirstRowAsHeader(true);
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
        } else {
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

    useEffect(() => {
        // CASE 1: Existing table selected
        if (createNewTable === "no") {
            if (selectedTable) {
                setTableName(selectedTable);
            } else {
                // No table selected → clean
                setTableName("");
            }
        }

        // CASE 2: Switch back to NEW table
        if (createNewTable === "yes") {
            setSelectedTable("");          // reset dropdown
            setTableName(
                apiData?.suggested_table_name ||
                uploadedFileName.replace(/\.[^/.]+$/, '')
            );
            setIsEditingTableName(false);  // reset edit mode
        }
    }, [createNewTable, selectedTable]);

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

    const handleDeleteColumn = (id: string) => {
        setColumns(columns.filter(col => col.id !== id));
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

    const handleNext = async () => {
        const schema = columns.map(col => ({
            column: col.name,
            datatype: col.dataType,
            length: col.length,
            primary: col.primary
        }));

        // STEP 1: CONFIGURE -> Create Table & Get Preview
        if (step === "configure") {
            setStep("loading");

            const payload = {
                action: createNewTable === 'yes' ? "create_table" : "preview",
                session_id: sessionId,
                created_by: createdBy,
                table_name: createNewTable === 'no' ? selectedTable : tableName,
                file_name: apiData?.file_name,
                schema: schema,
                is_existing: createNewTable === "no",
                treat_first_row_as_header: treatFirstRowAsHeader
            };

            console.log(" Sending configure step payload:", payload);

            try {
                const response = await ApiService.preview(payload);
                const resData = response.data.data;

                console.log("Configure Step Response:", resData);

                setCreateTableResponse(resData);
                setPreviewRows(resData?.preview_rows || []);
                settotalRows(resData?.total_rows || 0);
                setIsSchemaMismatch(false);
                setSchemaMismatchData(null);

                setSlideDirection("left");
                setTimeout(() => {
                    setStep("preview");
                    setSlideDirection("right");
                    setTimeout(() => setSlideDirection("none"), 50);
                }, 300);

            } catch (err: any) {
                console.error("Configure Step API Error:", err);
                const apiRes = err?.response?.data;

                if (err?.response?.status === 400 && apiRes?.message?.toLowerCase().includes("schema mismatch")) {
                    setIsSchemaMismatch(true);
                    setSchemaMismatchData({
                        message: apiRes.message,
                        extra_in_csv: apiRes?.data?.extra_in_csv || [],
                        missing_in_csv: apiRes?.data?.missing_in_csv || []
                    });
                } else {
                    setIsSchemaMismatch(true);
                    setSchemaMismatchData({
                        message: apiRes?.message || "An unexpected error occurred during table creation.",
                        extra_in_csv: [],
                        missing_in_csv: []
                    });
                }

                // Go to preview screen even on error to show the mismatch message
                setSlideDirection("left");
                setTimeout(() => {
                    setStep("preview");
                    setSlideDirection("right");
                    setTimeout(() => setSlideDirection("none"), 50);
                }, 300);
            }
            return;
        }


        // STEP 2: PREVIEW -> Insert Data
        // if (step === "preview") {
        //     if (insertData !== 'yes') return;
        //     setStep("loading");

        //     const insertPayload = {
        //         action: "insert_data",
        //         session_id: sessionId,
        //         created_by: createdBy,
        //         file_name: apiData?.file_name,
        //         table_name: createNewTable === 'no' ? selectedTable : tableName,
        //         is_existing: createNewTable === "no",
        //         schema: schema // Schema is still needed for validation on the backend
        //     };

        //     console.log(" Sending insert_data payload:", insertPayload);

        //     try {
        //         const response = await ApiService.preview(insertPayload);
        //         console.log(" Insert Response:", response.data);
        //         setInsertResponse(response?.data?.data);
        //     } catch (err) {
        //         console.error(" Insert API Error:", err);
        //         setInsertResponse({ summary_message: "Failed to insert data." });
        //     }

        //     setTimeout(() => {
        //         setStep("success"); // Go to final success/fail screen
        //     }, 800);

        //     return;
        // }


        // STEP 2: PREVIEW
        if (step === "preview") {

            const insertPayload = {
                action: "insert_data",
                session_id: sessionId,
                created_by: createdBy,
                file_name: apiData?.file_name,
                table_name: createNewTable === 'no' ? selectedTable : tableName,
                is_existing: createNewTable === "no",
                schema: schema,
                treat_first_row_as_header: treatFirstRowAsHeader
            };
            // CASE 1 → User chose NOT to insert data
            if (insertData === "no") {
                setInsertResponse({
                    summary_message: `Table "${tableName}" created successfully. Data was not inserted.`
                });

                setTimeout(() => {
                    setStep("success");
                }, 300);

                return;
            }

            // CASE 2 → Insert data = YES
            if (insertData === "yes") {
                setStep("loading");

                const insertPayload = {
                    action: "insert_data",
                    session_id: sessionId,
                    created_by: createdBy,
                    file_name: apiData?.file_name,
                    table_name: createNewTable === 'no' ? selectedTable : tableName,
                    is_existing: createNewTable === "no",
                    schema: schema
                };

                console.log("Sending insert_data payload:", insertPayload);

                try {
                    const response = await ApiService.preview(insertPayload);
                    setInsertResponse(response?.data?.data);
                } catch (err) {
                    console.error("Insert API Error:", err);
                    setInsertResponse({ summary_message: "Failed to insert data." });
                }

                setTimeout(() => {
                    setStep("success");
                }, 800);
            }

            return;
        }
    };

    const handleBack = () => {
        if (step === 'success') {
            setInsertData(""); // Reset choice
            setSlideDirection('right');
            setTimeout(() => {
                setStep('preview');
                setSlideDirection('left');
                setTimeout(() => {
                    setSlideDirection('none');
                }, 50);
            }, 300);
        } else if (step === 'preview') {
            setIsSchemaMismatch(false); // Reset error state
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
                <div className="p-12 overflow-y-auto flex-1 relative">
                    <div className={`transition-all duration-300 ${(step === 'loading' || step === 'success')
                        ? 'absolute inset-0 flex items-center justify-center'
                        : ''
                        } ${slideDirection === 'left' ? '-translate-x-full opacity-0' :
                            slideDirection === 'right' ? 'translate-x-full opacity-0' :
                                'translate-x-0 opacity-100'
                        }`}>
                        {step === 'configure' ? (
                            <>
                                {/* Create New Table Section */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Do you want to create a new table?
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
                                                <option value="">Select a Table</option>
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

                                {/* First Row as Header Checkbox */}

                                    <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={treatFirstRowAsHeader}
                                        onChange={(e) => setTreatFirstRowAsHeader(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-700 font-medium">
                                        Treat first row as header
                                    </span>
                                </label>

                                <div className="mb-1 flex flex-row text-center items-center gap-5">
                                    <h4 className="text-xs font-semibold text-gray-900">
                                        Uploaded File - {uploadedFileName}
                                    </h4>
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-900 ">
                                        {/* Table Name  -
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
                                        )} */}

                                        Table Name  -
                                        <div className="flex items-center gap-1">

                                            {/* EDIT MODE */}
                                            {createNewTable === "yes" && isEditingTableName ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={tempTableName}
                                                        onChange={(e) => setTempTableName(e.target.value)}
                                                        className="text-xs text-gray-700 border border-gray-300 rounded px-2 py-1"
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
                                                    {/* VIEW MODE */}
                                                    <p className="text-xs text-gray-700 font-medium">
                                                        {tableName}
                                                    </p>

                                                    {/* Edit icon ONLY for new table */}
                                                    {createNewTable === "yes" && (
                                                        <button
                                                            onClick={handleEditTableName}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit table name"
                                                        >
                                                            <Pencil className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-semibold text-gray-900">
                                            Extracted Columns
                                        </h4>
                                        {createNewTable === 'yes' && (
                                            <button
                                                onClick={handleAddColumn}
                                                className="px-3 py-1.5 bg-[#3D5B811A] rounded-lg text-gray-700 hover:text-blue-600 transition flex items-center gap-2"
                                                title="Add Column"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">Add Column</span>
                                            </button>
                                        )}
                                    </div>

                                    <ProductDataTable
                                        data={columns}
                                        globalFilter=""
                                        showPagination={false}
                                        columns={[
                                            {
                                                column_name: 'name',
                                                header: 'Column Name',
                                                sortable: true
                                            },
                                            {
                                                column_name: 'dataType',
                                                header: 'Data Type',
                                                sortable: true
                                            },
                                            {
                                                column_name: 'length',
                                                header: 'Length',
                                                sortable: true
                                            },
                                            {
                                                column_name: 'primary',
                                                header: 'Primary Key',
                                                sortable: false
                                            },
                                            ...(createNewTable === 'yes' ? [{
                                                column_name: 'actions',
                                                header: 'Actions',
                                                sortable: false
                                            }] : [])
                                        ]}
                                    />
                                </div> */}

                                {/* Extracted Column Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-semibold text-gray-900">
                                            Extracted Columns
                                        </h4>
                                    </div>

                                    {/* Table */}
                                    <div className="rounded-lg overflow-hidden">
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
                                                <div className="col-span-3 px-3 py-2 flex items-center gap-3">
                                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Action
                                                    </span>
                                                    <button
                                                        onClick={handleAddColumn}
                                                        className="p-1.5 bg-[#3D5B811A] rounded-full text-gray-700 hover:text-blue-600 transition"
                                                        title="Add Row"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {paginatedColumns.map((column) => (
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
                                                                <button
                                                                    onClick={() => handleDeleteColumn(column.id)}
                                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
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
                                                                <button
                                                                    onClick={() => handleDeleteColumn(column.id)}
                                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
                                            <div className="text-sm text-gray-600">
                                                Showing {startIndex + 1} to {endIndex} of {totalRecords} columns
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {/* Previous Button */}
                                                <button
                                                    onClick={onPrevious}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === 1
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    Previous
                                                </button>

                                                {/* Page Numbers */}
                                                {visiblePages.map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => onPageChange(page)}
                                                        className={`min-w-[32px] h-[32px] text-sm font-medium rounded-md transition-all ${currentPage === page
                                                            ? 'bg-gray-200 text-gray-900'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                                {/* Next Button */}
                                                <button
                                                    onClick={onNext}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${currentPage === totalPages
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : step === 'preview' ? (
                            <>
                                {/* Uploaded File Section */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        Uploaded File - {uploadedFileName}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                        {createNewTable === 'yes' && (
                                            <div className="flex items-center">
                                                <p className="text-xs text-gray-700 font-medium flex-1">
                                                    {tableName}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/*  CASE 1: SCHEMA MISMATCH (SHOW ERROR) */}
                                {isSchemaMismatch ? (
                                    <div className="p-6 bg-red-50 border border-red-300 rounded-xl">

                                        {/* TITLE */}
                                        <h4 className="text-base font-semibold text-red-700 text-center mb-6">
                                            ⚠️ {schemaMismatchData?.message?.toLowerCase().includes("schema mismatch")
                                                ? "Schema Mismatch Detected"
                                                : "Error Creating Table"}
                                        </h4>

                                        {/* CONTENT */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            {/* EXTRA COLUMNS */}
                                            <div className="bg-white border border-red-200 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-red-600 mb-3">
                                                    Extra Columns in CSV
                                                </p>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 max-h-56 overflow-y-auto">
                                                    {schemaMismatchData?.extra_in_csv?.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* MISSING COLUMNS */}
                                            <div className="bg-white border border-red-200 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-red-600 mb-3">
                                                    Missing Columns in CSV
                                                </p>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 max-h-56 overflow-y-auto">
                                                    {schemaMismatchData?.missing_in_csv?.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4 text-xs text-red-700">
                                            Please go back and correct the schema or upload a valid file.
                                            <br />
                                            <span className="font-bold">{schemaMismatchData?.message}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/*  CASE 2: NORMAL PREVIEW TABLE */}
                                        <div>
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <h4 className="text-xs font-semibold text-gray-900">{createTableResponse?.summary_message || `Table "${tableName}" created successfully.`}</h4>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-semibold text-gray-900">
                                                    Column Preview (Showing 5 out of {totalRows} rows)
                                                </h4>
                                            </div>

                                            <div className="rounded-lg overflow-auto">
                                                <div
                                                    className="grid bg-gray-50 border-b border-gray-200 border-opacity-30"
                                                    style={{
                                                        gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`
                                                    }}
                                                >
                                                    {columns.map((column) => (
                                                        <div
                                                            key={column.id}
                                                            className="px-3 py-2 border-r border-gray-200 border-opacity-30 last:border-r-0"
                                                        >
                                                            <span className="text-xs font-semibold text-[#3D5B81] uppercase tracking-wider">
                                                                {column.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {previewRows.length > 0 ? (
                                                    previewRows.map((row, rowIndex) => (
                                                        <div
                                                            key={rowIndex}
                                                            className="grid border-b border-gray-200 border-opacity-30 last:border-b-0 hover:bg-gray-50 transition-colors"
                                                            style={{
                                                                gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`
                                                            }}
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

                                        <div className="mt-8">
                                            <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                                Do you want to insert the data?
                                            </h4>
                                            <div className="flex gap-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insertData"
                                                        value="yes"
                                                        checked={insertData === "yes"}
                                                        onChange={() => setInsertData("yes")}
                                                        className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-1.5 text-xs text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insertData"
                                                        value="no"
                                                        checked={insertData === "no"}
                                                        onChange={() => setInsertData("no")}
                                                        className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-1.5 text-xs text-gray-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : step === 'loading' ? (
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <p className="text-sm text-gray-600">Processing...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {insertResponse?.summary_message
                                            ? insertResponse.summary_message
                                            : `Data inserted into "${tableName}" successfully.`}
                                    </h4>
                                </div>
                            </>
                        )}
                    </div>
                </div>

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
                            onClick={() => {
                                if (onFinish) onFinish();
                                onClose();
                            }}
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
                            {/* <button
                                onClick={handleNext}
                                disabled={
                                    (step === 'preview' && (insertData !== "yes" || isSchemaMismatch)) ||
                                    (step === 'configure' && (createNewTable === 'no' && !selectedTable))
                                }
                                className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-colors
                                    ${(step === 'preview' && (insertData !== "yes" || isSchemaMismatch)) ||
                                    (step === 'configure' && (createNewTable === 'no' && !selectedTable))
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }
                                `}
                            >
                                {step === 'configure'
                                    ? (createNewTable === 'yes' ? 'Create Table & Preview' : 'Preview')
                                    : 'Next'}
                            </button> */}

                            <button
                                onClick={handleNext}
                                disabled={step === 'preview' && insertData === ""}
                                className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-colors ${step === 'preview' && insertData === ""
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {step === 'configure'
                                    ? (createNewTable === 'yes' ? 'Create Table & Preview' : 'Preview')
                                    : insertData === 'yes'
                                        ? 'Insert & Finish'
                                        : 'Finish'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableImportModal;