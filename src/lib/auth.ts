import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

// Google Login
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const token = await result.user.getIdToken(true);
  return { user: result.user, token };
}

// Email SignUp

export async function signUpWithEmail(email: string, password: string, name: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 🔑 Atualiza o perfil para incluir o nome
  await updateProfile(userCredential.user, { displayName: name });

  const token = await userCredential.user.getIdToken(true);

  return { user: userCredential.user, token };
}

// Email Login
export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken(true);
  return { user: userCredential.user, token };
}
