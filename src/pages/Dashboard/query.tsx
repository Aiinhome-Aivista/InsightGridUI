import { LuRefreshCw } from "react-icons/lu";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Query = () => {
  const navigate = useNavigate();
  return (
    <div className=" mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Query Designer</h1>
          <p className="text-sm text-gray-500">
            Start by uploading a data file to create your first view.
          </p>
        </div>

        <button
          onClick={() => navigate("/layout/query-designer")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium shadow mx-6"
        >
          Create Query
        </button>

        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="flex justify-end">
            <div className="relative w-[25rem]">
              <input
                type="text"
                placeholder="Global Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m2.6-5.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
              </svg>
            </div>
          </div>

          {/* Refresh icon */}
          <div style={{ backgroundColor: '#D9D9D9' }} className="p-3 rounded-xl">
            <LuRefreshCw />
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Query</th>
              <th className="text-left px-6 py-3 font-medium">Time</th>
              <th className="text-left px-6 py-3 font-medium">Row Effected</th>
              <th className="text-left px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">

            <tr>
              <td className="px-6 py-4 font-medium">
                Category and product relation
              </td>
              <td className="px-6 py-4 text-gray-600">10 mints</td>
              <td className="px-6 py-4 text-gray-600">10,000</td>
              <td className="px-6 py-4">
                <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200">
                  Edit
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-medium">
                Category Details
              </td>
              <td className="px-6 py-4 text-gray-600">22 mints</td>
              <td className="px-6 py-4 text-gray-600">12,000</td>
              <td className="px-6 py-4">
                <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200">
                  Edit
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-medium">
                Show salary details for April month
              </td>
              <td className="px-6 py-4 text-gray-600">7 mints</td>
              <td className="px-6 py-4 text-gray-600">8,000</td>
              <td className="px-6 py-4">
                <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200">
                  Edit
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* <div className="flex flex-col justify-center w-full">
        <MdOutlineHourglassEmpty size={50} />
        <p className="text-gray-500 text-lg ml-4 mt-3">Empty Query list</p>
      </div> */}

    </div>
  );
};

export default Query;