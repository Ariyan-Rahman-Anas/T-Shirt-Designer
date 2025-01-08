import { useEffect, useState } from "react";

const Table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.razzakfashion.com");
        if (!res.ok) throw new Error("Failed to fetch data");
        const res2 = await res.json();
        setData(res2);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting function
  const sortData = (data) => {
    if (!sortConfig.key) return data;

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const isSameKey = prevConfig.key === key;
      const direction = isSameKey && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  const filteredData = data?.data?.filter(
    (row) =>
      row.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      row.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      row.email_verified_at?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      row.created_at?.toLowerCase().includes(searchTerm?.toLowerCase())
  );


  const sortedAndFilteredData = sortData(filteredData);
  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredData?.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = sortedAndFilteredData?.slice(startIndex, startIndex + rowsPerPage);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="text-center min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (error) return <div className="text-center text-red-500 min-h-screen flex items-center justify-center"><p>{error}</p></div>;

  return (
    <div className="p-6 bg-gray-900 m-2 text-white rounded-lg overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search area..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full text-left text-sm border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 border border-gray-700">
              <input type="checkbox" />
            </th>
            <th className="p-3 border border-gray-700">Id</th>
            <th
              className="p-3 border border-gray-700 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑↓"}
            </th>  
            <th
              className="p-3 border border-gray-700 cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑↓"}
            </th>
            <th
              className="p-3 border border-gray-700 cursor-pointer"
              onClick={() => handleSort("email_verified_at")}
            >
              Verified at {sortConfig.key === "email_verified_at" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑↓"}
            </th>
            <th
              className="p-3 border border-gray-700 cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Created at {sortConfig.key === "created_at" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPageData?.length > 0 ? (
            currentPageData.map(({ id, name, email, email_verified_at, created_at }, index) => (
              <tr key={index} className="even:bg-gray-800 odd:bg-gray-700">
                <td className="p-3 border border-gray-700">
                  <input type="checkbox" />
                </td>
                <td className="p-3 border border-gray-700">{id}</td>
                <td className="p-3 border border-gray-700">{name}</td>
                <td className="p-3 border border-gray-700">{email}</td>
                <td className="p-3 border border-gray-700">{email_verified_at?.slice(0, 10)}</td>
                <td className="p-3 border border-gray-700">{created_at?.slice(0, 10)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-3">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex flex-col md:flex-row justify-end items-center gap-6 text-gray-300">
        <div className="flex items-center gap-2">
          <p>Row per page</p>
          <select
            name="rowsPerPage"
            id="rowsPerPage"
            onChange={(e) => setRowsPerPage(e.target.value)}
          className="bg-gray-900 p-2 w-20 focus:outline-none border rounded-lg border-gray-500 focus:border-white "
          >
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>
        <div>
          <p>{currentPageData?.[0]?.id}-{currentPageData?.[currentPageData?.length - 1]?.id} of {data?.data?.length}</p>
        </div>
        <div>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            &#x276E;
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            &#x276F;
          </button>
        </div>
      </div>
    </div>
  );
};
export default Table;