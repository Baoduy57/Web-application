// app/api/contacts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const config = {
  api: { bodyParser: true },
};

// GET /api/contacts/[id]
export async function GET(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    const contact = await Contact.findById(id).lean();
    if (!contact) {
      return NextResponse.json(
        { message: "Không tìm thấy liên hệ" },
        { status: 404 }
      );
    }
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

// PUT /api/contacts/[id]
export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();

  const { name, email, phone, group } = body;

  try {
    const updated = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, group },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Không tìm thấy liên hệ để cập nhật" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật liên hệ", error },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id]
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Không tìm thấy liên hệ để xoá" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Xoá liên hệ thành công",
      deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xoá liên hệ", error },
      { status: 500 }
    );
  }
}
