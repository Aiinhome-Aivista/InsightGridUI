import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// --- Component 1: The Toggle Button ---
interface ProcedureToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ProcedureToggleButton = ({ isOpen, onToggle }: ProcedureToggleButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-xs font-medium transition-all"
    >
      Procedure View
      <KeyboardArrowUpIcon
        sx={{ fontSize: "1rem" }}
        className={`transform transition-transform duration-300 ${
          isOpen ? "" : "rotate-180"
        }`}
      />
    </button>
  );
};

// --- Component 2: The Collapsible Code Block ---
interface ProcedureCodeBlockProps {
  isVisible: boolean;
}

export const ProcedureCodeBlock = ({ isVisible }: ProcedureCodeBlockProps) => {
  const sqlCode = `DELIMITER $$

CREATE PROCEDURE GetProductInsights()
BEGIN
    SELECT
        department,
        CASE
            WHEN category_type = 'Most Viewed' THEN item
            WHEN category_type = 'Most Purchased' THEN item
            WHEN category_type = 'Trending' THEN item
            WHEN category_type = 'Low Stock' THEN item
        END AS category_item,
        category_type
    FROM product_insights;
END $$

DELIMITER ;`;

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isVisible ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"
      }`}
    >
      <div className="p-4 bg-gray-50/50 rounded-lg">
        <pre className="text-xs font-mono text-indigo-500 whitespace-pre-wrap leading-relaxed">
          {sqlCode}
        </pre>
      </div>
    </div>
  );
};