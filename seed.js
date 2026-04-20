const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function seed() {
  console.log('Starting seed...');

  // 1. Create Users
  const usersToCreate = [
    { email: 'admin@amu.ac.in', password: 'password123', name: 'System Admin', role: 'admin' },
    { email: 'staff@amu.ac.in', password: 'password123', name: 'Library Staff', role: 'staff' },
    { email: 'student1@amu.ac.in', password: 'password123', name: 'Alice Student', role: 'student' },
    { email: 'student2@amu.ac.in', password: 'password123', name: 'Bob Student', role: 'student' }
  ];

  for (const u of usersToCreate) {
    try {
      let uid;
      try {
        const userRecord = await auth.getUserByEmail(u.email);
        uid = userRecord.uid;
        console.log(`User ${u.email} already exists in Auth. Updating their Firestore role...`);
      } catch(e) {
        if (e.code === 'auth/user-not-found') {
          const userRecord = await auth.createUser({
            email: u.email,
            password: u.password,
            displayName: u.name,
          });
          uid = userRecord.uid;
          console.log(`Created Auth user ${u.email}`);
        } else {
          throw e;
        }
      }

      await db.collection('users').doc(uid).set({
        email: u.email,
        displayName: u.name,
        role: u.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`Assigned role '${u.role}' to ${u.email} in Firestore.`);
    } catch(err) {
      console.error(`Error creating user ${u.email}:`, err);
    }
  }

  // 2. Create Books
  const booksToCreate = [
    { name: 'Introduction to Algorithms by Thomas H. Cormen', totalBooks: 5, availableBooks: 5 },
    { name: 'Clean Code by Robert C. Martin', totalBooks: 3, availableBooks: 3 },
    { name: 'Design Patterns by Gang of Four', totalBooks: 4, availableBooks: 4 },
    { name: 'The Pragmatic Programmer', totalBooks: 2, availableBooks: 2 }
  ];

  for (const b of booksToCreate) {
    try {
      const newBook = {
        name: b.name,
        totalBooks: b.totalBooks,
        availableBooks: b.availableBooks,
        addedBy: 'system-seed',
        borrowers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.collection('books').add(newBook);
      console.log(`Added book: ${b.name}`);
    } catch (err) {
      console.error(`Error creating book ${b.name}:`, err);
    }
  }

  console.log('\nSeed complete successfully!');
  process.exit(0);
}

seed();
