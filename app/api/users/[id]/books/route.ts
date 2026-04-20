import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const uid = id; // Map id to uid for our logic
    
    // Fetch all books (filter on the server since Firestore array-contains on objects is not supported)
    const snapshot = await adminDb.collection('books').get();
    
    const borrowedBooks = [];
    
    for (const doc of snapshot.docs) {
      const bookData = doc.data();
      if (bookData.borrowers && Array.isArray(bookData.borrowers)) {
        const userBorrowRecord = bookData.borrowers.find((b: any) => b.uid === uid);
        if (userBorrowRecord) {
          borrowedBooks.push({
            id: doc.id,
            name: bookData.name,
            borrowDate: userBorrowRecord.date
          });
        }
      }
    }
    
    return NextResponse.json({ books: borrowedBooks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
