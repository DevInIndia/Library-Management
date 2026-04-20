import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const { uid } = await request.json();
    
    const bookRef = adminDb.collection('books').doc(id);
    const doc = await bookRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Book does not exist" }, { status: 404 });
    }
    
    const data = doc.data()!;
    
    // Check if user is actually in the borrowers list
    const borrowerIndex = data.borrowers?.findIndex((b: any) => b.uid === uid);
    
    if (borrowerIndex === -1 || borrowerIndex === undefined) {
      return NextResponse.json({ error: "You have not borrowed this book" }, { status: 400 });
    }
    
    // Remove the specific user from the array
    const updatedBorrowers = [...data.borrowers];
    updatedBorrowers.splice(borrowerIndex, 1);
    
    // Update firestore: increment available books and update array
    await bookRef.update({
      availableBooks: data.availableBooks + 1,
      borrowers: updatedBorrowers,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
