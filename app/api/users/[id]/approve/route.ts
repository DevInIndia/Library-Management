import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from 'firebase-admin';

export async function POST(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const { action } = await request.json(); 
    
    const userRef = adminDb.collection('users').doc(id);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const data = doc.data()!;
    
    if (action === 'approve') {
      await userRef.update({
        role: data.requestedRole,
        requestedRole: admin.firestore.FieldValue.delete(),
        approvalStatus: admin.firestore.FieldValue.delete(),
      });
    } else if (action === 'reject') {
      await userRef.update({
        requestedRole: admin.firestore.FieldValue.delete(),
        approvalStatus: admin.firestore.FieldValue.delete(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
