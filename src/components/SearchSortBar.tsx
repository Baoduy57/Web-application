"use client";

interface SearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

export default function SearchSortBar({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
}: SearchSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <input
        type="text"
        placeholder="🔍 Tìm theo tên..."
        className="border px-3 py-2 rounded w-full sm:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sắp xếp: {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </button>
    </div>
  );
}
