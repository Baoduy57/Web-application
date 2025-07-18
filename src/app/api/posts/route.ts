import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb"; // Sử dụng đúng dbConnect của post
import { Post } from "@/models/Post";
import formidable, { Fields, Files } from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

// GET /api/posts
export async function GET(_req: NextRequest) {
  await dbConnect();

  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

// POST /api/posts
export async function POST(req: NextRequest) {
  await dbConnect();

  const form = formidable({
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    allowEmptyFiles: false,
  });

  const stream = toNodeReadable(req);
  const { fields, files }: { fields: Fields; files: Files } = await new Promise(
    (res, rej) => {
      form.parse(stream as any, (err, flds, fls) =>
        err ? rej(err) : res({ fields: flds, files: fls })
      );
    }
  );

  let imageUrl = "";
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "posts",
    });
    imageUrl = uploadResult.secure_url;
  }

  try {
    const post = new Post({
      name: fields.name?.[0],
      description: fields.description?.[0],
      image: imageUrl,
    });
    await post.save();
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}
