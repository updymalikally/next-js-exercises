import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import User from "../../../models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !email || password.length < 8) {
      return NextResponse.json({ error: "Enter your name and email, and use a password with at least 8 characters." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await connectDB();
    if (await User.exists({ email })) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    await User.create({ name, email, password: await hash(password, 12) });
    return NextResponse.json({ message: "Account created." }, { status: 201 });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Could not create the account. Check the database connection and try again." }, { status: 500 });
  }
}
