import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email, password, name, requestedRole } = await request.json();
    
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const userData: any = {
      email,
      displayName: name,
      role: 'student', // Default base role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (requestedRole === 'staff' || requestedRole === 'admin') {
      userData.requestedRole = requestedRole;
      userData.approvalStatus = 'pending';
    }

    // Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
