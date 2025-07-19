"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import SearchSortBar from "@/components/SearchSortBar";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  group: string;
}

export default function ContactListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [group, setGroup] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      toast.error("Failed to load contacts.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this contact?");
    if (!confirmed) return;

    const res = await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Contact deleted!");
    } else {
      toast.error("Failed to delete contact.");
    }
  };

  const groups = Array.from(
    new Set(contacts.map((c) => c.group).filter(Boolean))
  );

  const filteredContacts = contacts
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (group ? c.group === group : true)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800">📇 Contact List</h1>
        <Link
          href="/create"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          ➕ Add New Contact
        </Link>
      </div>

      <SearchSortBar
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        group={group}
        setGroup={setGroup}
        groups={groups}
      />

      <div className="space-y-4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="border rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {contact.name}
                </h2>
                <p className="text-gray-600">📧 {contact.email}</p>
                {contact.phone && (
                  <p className="text-gray-600">📱 {contact.phone}</p>
                )}
                {contact.group && (
                  <p className="text-gray-500">👥 Group: {contact.group}</p>
                )}
              </div>

              <div className="flex gap-2 sm:flex-col sm:items-end">
                <Link
                  href={`/edit/${contact._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded transition"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No contacts found.</p>
        )}
      </div>
    </main>
  );
}
