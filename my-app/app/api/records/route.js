import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const collection = await getCollection("records");
    

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email-ul lipsește" }, { status: 400 });
    }

    const tasks = await collection.find({ userEmail: email }).toArray();
    
    return NextResponse.json(tasks);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection("records");
    

    const result = await collection.insertOne({
      task: body.task,
      priority: body.priority,
      description: body.description,
      user: body.user,
      userEmail: body.userEmail, 
      completed: false,
      createdAt: new Date()
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, completed } = await request.json();
    const collection = await getCollection("records");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: completed } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task-ul nu a fost găsit" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const collection = await getCollection("records");
    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}