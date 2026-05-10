import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const { titlu, descriere, prioritate, deadline, userEmail } = await request.json();
    const client = await clientPromise;
    const db = client.db("todo_db");

    const newTodo = await db.collection("todos").insertOne({
      titlu,
      descriere,
      prioritate,
      deadline,
      user: userEmail, 
      completed: false,
      createdAt: new Date()
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("todo_db");

  
    const todos = await db.collection("todos")
      .find({ user: email })
      .sort({ createdAt: -1 }) 
      .toArray();

    return NextResponse.json(todos, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}