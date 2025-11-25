function Sidebar() {
  return (
    <div className="w-1/5 px-8 py-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Collection</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Collections help you organize and group your data columns in a meaningful way. 
        Select columns from the list to add them to your collection. You can use multi-select 
        mode for quick selection or drag & drop mode for more control. Once configured, 
        your collection will be saved and can be reused across different views and reports.
      </p>
    </div>
  );
}
export default Sidebar;