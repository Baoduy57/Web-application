"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateContact() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    group: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("❌ Invalid email address");
      return;
    }

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }

      toast.success(" Contact created successfully");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 py-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        📇 Create New Contact
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. john.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 10) {
                setForm({ ...form, phone: value });
              }
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. 0981234567"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">
            Contact Group
          </label>
          <select
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select group (optional) --</option>
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
            <option value="Work">Work</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow"
          >
            ➕ Create Contact
          </button>
        </div>
      </form>
    </div>
  );
}
