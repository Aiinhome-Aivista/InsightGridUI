import React from "react";
import { useAuth } from "../pages/Auth/AuthContext";

interface ConfirmSaveViewProps {
  type?: string;
  customTitle?: string;
  customMessage?: string;
  customOnCancel?: () => void;
  customOnConfirm?: () => void;
  showConfirmButton?: boolean;
}

export default function ConfirmSaveView({
  type = "Query",
  customTitle,
  customMessage,
  customOnCancel,
  customOnConfirm,
  showConfirmButton = true,
}: ConfirmSaveViewProps) {
  const { isConfirmSaveModalOpen, setIsConfirmSaveModalOpen, viewName, confirmSave } = useAuth();

  const onCancel = customOnCancel || (() => setIsConfirmSaveModalOpen(false));
  const onConfirm = customOnConfirm || confirmSave;
  const displayTitle = customTitle || viewName;
  const displayMessage = customMessage || `Do you want to save the ${type.toLowerCase()}?`;
  const isDuplicateMessage =
    !!customMessage &&
    customMessage.toLowerCase().includes("already exists");


  if (!isConfirmSaveModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[550px] bg-[#D9D9D9] rounded-2xl shadow-lg border-[11px] border-white flex flex-col justify-center items-center gap-6 p-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg">{customTitle ? "File Name" : `${type} Name`}</p>
          <h2 className="text-2xl font-semibold text-gray-700">{displayTitle}</h2>
        </div>

        {/* <p className="text-gray-600 text-xl whitespace-pre-line text-center">
          {displayMessage}
        </p> */}

        <p
          className={`text-xl whitespace-pre-line text-center ${isDuplicateMessage ? "text-red-600 font-medium" : "text-gray-600"
            }`}
        >
          {displayMessage}
        </p>


        <div className="flex gap-4">
          {showConfirmButton ? (
            <>
              <button
                className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-[#4B1AE7] hover:text-white transition"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-[#4B1AE7] text-white hover:opacity-90 transition"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 rounded-lg bg-[#4B1AE7] text-white hover:opacity-90 transition"
              onClick={onCancel}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}