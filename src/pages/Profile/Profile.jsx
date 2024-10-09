import { auth } from "../../FirebaseConfig";

export default function Profile() {
  const user = auth.currentUser; // Directly access the authenticated user

  return (
    <div>
      <h1>Welcome to your Profile</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.uid}</p>
    </div>
  );
}
