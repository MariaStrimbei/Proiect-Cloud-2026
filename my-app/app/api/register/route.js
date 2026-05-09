import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // 1. Extragem datele trimise din formular
    const { name, email, password } = await req.json();

    // 2. Validare de bază (opțional, dar recomandat)
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Toate câmpurile sunt obligatorii." },
        { status: 400 }
      );
    }

    // 3. Conectarea la colecția "users" din MongoDB
    const collection = await getCollection("users");

    // 4. Verificăm dacă utilizatorul există deja în baza de date
    const userExists = await collection.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { error: "Acest email este deja utilizat de un alt cont." },
        { status: 400 }
      );
    }

    // 5. Criptăm parola (nu salvăm niciodată parole în format text!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Salvăm noul utilizator
    const result = await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Utilizator creat cu succes!", id: result.insertedId },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Eroare la înregistrare:", error);
    return NextResponse.json(
      { error: "A apărut o eroare la server. Încearcă din nou." },
      { status: 500 }
    );
  }
}