"use client";

interface SearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  group: string;
  setGroup: (value: string) => void;
  groups: string[];
}

export default function SearchSortBar({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  group,
  setGroup,
  groups,
}: SearchSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <input
        type="text"
        placeholder="🔍 Search by name..."
        className="border px-4 py-2 rounded-md w-full sm:w-1/2 shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 items-center w-full sm:w-auto">
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="border px-3 py-2 rounded-md bg-white shadow-sm"
        >
          <option value="">All Groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Sort: {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>
    </div>
  );
}
