"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Lấy dữ liệu bài viết hiện tại
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
        });
      } else {
        toast.error("❌ Không tìm thấy bài viết.");
      }
    })();
  }, [id]);

  // Submit cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Cập nhật thất bại");

      toast.success("Cập nhật bài viết thành công!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-md mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        ✏️ Cập nhật bài viết
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tiêu đề */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Tiêu đề
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border rounded px-4 py-2 focus:ring focus:border-blue-400"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
            className="w-full border rounded px-4 py-2 focus:ring focus:border-blue-400"
          ></textarea>
        </div>

        {/* Ảnh bài viết */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Ảnh bài viết
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImageFile(file);
            }}
            className="w-full"
          />

          <div className="flex gap-4 mt-3">
            {form.image && !imageFile && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Ảnh hiện tại</p>
                <img
                  src={form.image}
                  alt="Ảnh bài viết"
                  className="w-28 h-28 object-cover rounded border"
                />
              </div>
            )}

            {imageFile && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Ảnh mới</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Ảnh mới"
                  className="w-28 h-28 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Nút cập nhật */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Đang cập nhật..." : "✅ Cập nhật bài viết"}
        </button>
      </form>
    </div>
  );
}
