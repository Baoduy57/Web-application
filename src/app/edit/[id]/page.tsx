"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditContact() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    group: "",
  });

  // Fetch current contact
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/contacts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Contact not found");

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          group: data.group || "",
        });
      } catch (error: any) {
        toast.error(`❌ ${error.message}`);
      }
    })();
  }, [id]);

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      toast.success("✅ Contact updated successfully!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        ✏️ Edit Contact
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter email address"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.phone}
            onChange={(e) => {
              // Loại bỏ ký tự không phải số
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: value });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Optional phone number"
          />
        </div>

        {/* Group */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Group
          </label>
          <select
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select group (optional) --</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Work">Work</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Updating..." : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
}
