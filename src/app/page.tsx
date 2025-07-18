"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchSortBar from "@/components/SearchSortBar";
import { ToastContainer, toast } from "react-toastify";

interface Post {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Bạn có chắc chắn muốn xoá bài viết?");
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post._id !== id));
      toast.success(" Đã xoá bài viết thành công!");
    } else {
      toast.error(" Lỗi khi xoá bài viết!");
    }
  };

  const filteredPosts = posts
    .filter((post) => post.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">📋 Danh sách Bài đăng</h1>

      <SearchSortBar
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <Link
        href="/create"
        className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Tạo bài viết mới
      </Link>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="border rounded p-4 shadow flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{post.name}</h2>
                <p className="text-gray-600 mt-1">{post.description}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.name}
                    className="mt-2 w-40 h-40 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 sm:items-end justify-center">
                <Link
                  href={`/edit/${post._id}`}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded text-center"
                >
                  ✏️ Sửa
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                >
                  🗑️ Xoá
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bài viết nào.</p>
        )}
      </div>
    </main>
  );
}
