import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();
    
    if (role !== "staff" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    let usersQuery = adminDb.collection('users');
    const snapshot = await usersQuery.get();
    
    let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (role === "staff") {
      users = users.filter((u: any) => u.role === "staff");
    } else if (role === "admin") {
      users = users.filter((u: any) => u.role === "staff" || u.role === "admin");
    }

    users = users.map((u: any) => ({
      id: u.id,
      displayName: u.displayName,
      email: u.email,
      role: u.role
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
