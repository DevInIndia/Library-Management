import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request, context: any) {
  try {
    // Await params if they are treated as a promise in next 15+ 
    // Usually context.params is accessible directly, but depends on Next.js setup.
    const { id } = await context.params;
    const { uid, userName } = await request.json();
    
    const bookRef = adminDb.collection('books').doc(id);
    const doc = await bookRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Book does not exist" }, { status: 404 });
    }
    
    const data = doc.data()!;
    if (data.availableBooks <= 0) {
      return NextResponse.json({ error: "No copies available" }, { status: 400 });
    }
    
    const alreadyBorrowed = data.borrowers?.some((b: any) => b.uid === uid);
    if (alreadyBorrowed) {
      return NextResponse.json({ error: "You have already borrowed this book" }, { status: 400 });
    }
    
    const newBorrower = { uid, name: userName, date: new Date().toISOString() };
    const updatedBorrowers = [...(data.borrowers || []), newBorrower];
    
    await bookRef.update({
      availableBooks: data.availableBooks - 1,
      borrowers: updatedBorrowers,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
