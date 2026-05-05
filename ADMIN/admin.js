// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyCN56TY6ndgVZpJlADNaNqqG6luJZb6xx0",
  authDomain: "student-reporting-platform.firebaseapp.com",
  projectId: "student-reporting-platform",
  storageBucket: "student-reporting-platform.appspot.com",
  messagingSenderId: "775304519881",
  appId: "1:775304519881:web:4277530d1d938a5105ed18"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// --- UI NOTIFICATIONS ---
const toastMsg = document.getElementById('toastMsg');
const toastHeader = document.getElementById('toastHeader');
const toastTrigger = new bootstrap.Toast(document.getElementById('liveToast'));

function notify(message, isError = false) {
    toastMsg.innerText = message;
    toastHeader.className = isError ? "toast-header bg-danger text-white" : "toast-header bg-success text-white";
    toastTrigger.show();
}

// --- CORE REGISTRATION LOGIC ---
async function handleRegistration(e, collection) {
    e.preventDefault(); // STOPS THE PAGE REFRESH (Fixes the URL issue)
    
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const email = formData.get('email');

    // 1. Validation
    if (password !== confirmPassword) {
        notify("Passwords do not match!", true);
        return;
    }

    // 2. Prepare Data Object (excluding passwords)
    const userData = {};
    formData.forEach((value, key) => {
        if (key !== 'password' && key !== 'confirmPassword') {
            userData[key] = value;
        }
    });

    try {
        // 3. Create User in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // 4. Create Firestore Profile using the same UID
        await db.collection(collection).doc(uid).set({
            ...userData,
            uid: uid,
            isSRC: false, // Default status
            rank: "Member", // Default rank
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        notify(`${userData.firstName} registered successfully!`);
        e.target.reset();
    } catch (error) {
        notify(error.message, true);
    }
}

// --- FORM LISTENERS ---
document.getElementById('addFacultyForm').addEventListener('submit', (e) => handleRegistration(e, 'faculty'));
document.getElementById('addStudentForm').addEventListener('submit', (e) => handleRegistration(e, 'students'));

// --- REAL-TIME DASHBOARD LOGIC ---

// Students & SRC Listener
db.collection('students').onSnapshot(snapshot => {
    const tbody = document.getElementById('studentsTbody');
    const srcTbody = document.getElementById('srcTbody');
    tbody.innerHTML = '';
    srcTbody.innerHTML = '';

    snapshot.forEach(doc => {
        const s = doc.data();
        const fullName = `${s.firstName} ${s.lastName}`;
        
        // Main Table
        tbody.innerHTML += `
            <tr>
                <td>${fullName}</td>
                <td>${s.student_id}</td>
                <td>${s.room_number}</td>
                <td>${s.department}</td>
                <td>
                    <button class="btn btn-promote btn-sm" onclick="toggleSRC('${doc.id}', ${s.isSRC})">
                        ${s.isSRC ? 'Demote' : 'Make SRC'}
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteUser('${doc.id}', 'students')">Delete</button>
                </td>
            </tr>`;
        
        // SRC Special Table
        if (s.isSRC) {
            srcTbody.innerHTML += `
                <tr>
                    <td>${fullName}</td>
                    <td><span class="badge bg-primary">SRC Rep</span></td>
                    <td><button class="btn btn-link btn-sm text-danger" onclick="toggleSRC('${doc.id}', true)">Remove</button></td>
                </tr>`;
        }
    });
});

// Faculty & Ranks Listener
db.collection('faculty').onSnapshot(snapshot => {
    const tbody = document.getElementById('facultyTbody');
    const ranksTbody = document.getElementById('ranksTbody');
    tbody.innerHTML = '';
    ranksTbody.innerHTML = '';

    snapshot.forEach(doc => {
        const f = doc.data();
        const fullName = `${f.firstName} ${f.lastName}`;

        // Main Table
        tbody.innerHTML += `
            <tr>
                <td>${fullName}</td>
                <td>${f.worker_id}</td>
                <td>${f.department}</td>
                <td>
                    <button class="btn btn-dark btn-sm" onclick="setRank('${doc.id}')">Set Rank</button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteUser('${doc.id}', 'faculty')">Delete</button>
                </td>
            </tr>`;

        // Ranked Table
        if (f.rank && f.rank !== "Member") {
            ranksTbody.innerHTML += `
                <tr>
                    <td>${fullName}</td>
                    <td><span class="badge bg-dark">${f.rank}</span></td>
                    <td><button class="btn btn-link btn-sm text-danger" onclick="clearRank('${doc.id}')">Clear</button></td>
                </tr>`;
        }
    });
});

// --- ADMIN ACTIONS ---

async function toggleSRC(id, currentStatus) {
    await db.collection('students').doc(id).update({ isSRC: !currentStatus });
}

async function setRank(id) {
    const newRank = prompt("Enter Rank (e.g., Dean, Head of Dept, Senior):");
    if (newRank) {
        await db.collection('faculty').doc(id).update({ rank: newRank });
    }
}

async function clearRank(id) {
    await db.collection('faculty').doc(id).update({ rank: "Member" });
}

async function deleteUser(id, collection) {
    if (confirm("Delete this user profile? (Note: Auth account remains in Firebase console)")) {
        await db.collection(collection).doc(id).delete();
        notify("User deleted from database.");
    }
}