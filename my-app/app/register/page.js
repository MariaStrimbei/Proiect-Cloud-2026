export const dynamic = "force-dynamic";
import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const collection = await getCollection("users");

    const exists = await collection.findOne({ email });
    if (exists) return NextResponse.json({ error: "User deja existent" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.insertOne({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Succes" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}