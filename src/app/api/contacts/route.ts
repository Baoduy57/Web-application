import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export const config = {
  api: { bodyParser: true },
};

// GET /api/contacts - Lấy danh sách tất cả contact
export async function GET(_req: NextRequest) {
  await dbConnect();

  try {
    const contacts = await Contact.find().sort({ name: 1 }); // Sort A-Z
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}

// POST /api/contacts - Tạo mới một contact
export async function POST(req: NextRequest) {
  await dbConnect();

  const { name, email, phone, group } = await req.json();

  // Validate cơ bản
  if (!name || !email) {
    return NextResponse.json(
      { message: "Tên và email là bắt buộc." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Email không hợp lệ." },
      { status: 400 }
    );
  }

  try {
    const contact = new Contact({ name, email, phone, group });
    await contact.save();
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
  }
}
