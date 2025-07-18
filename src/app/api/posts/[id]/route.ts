import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import formidable from "formidable";
import { toNodeReadable } from "@/lib/toNodeReadable";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

// GET /api/posts/[id]
export async function GET(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json(
        { message: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

// PUT /api/posts/[id]
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  const form = formidable({ keepExtensions: true });
  const { fields, files } = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((res, rej) => {
    form.parse(toNodeReadable(req) as any, (err, flds, fls) =>
      err ? rej(err) : res({ fields: flds, files: fls })
    );
  });

  let imagePath: string | undefined;
  if (files.image) {
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: "posts",
    });
    imagePath = upload.secure_url;
  }

  try {
    const updated = await Post.findByIdAndUpdate(
      id,
      {
        name: fields.name?.[0],
        description: fields.description?.[0],
        ...(imagePath && { image: imagePath }),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để cập nhật" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật bài viết", error },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Không tìm thấy bài viết để xoá" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Xoá bài viết thành công",
      deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xoá bài viết", error },
      { status: 500 }
    );
  }
}
