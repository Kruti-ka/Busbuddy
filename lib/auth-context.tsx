"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "./firebase"

interface UserProfile {
  fullName?: string
  email?: string
  mobile?: string
  gender?: string
  username?: string
  profileImageUrl?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, userData: UserProfile) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>, profileImageFile?: File | null) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])


   
  const signUp = async (email: string, password: string, userData: UserProfile) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile in Firebase Auth
      await updateFirebaseProfile(user, {
        displayName: userData.fullName || "",
      })

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        email,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>, profileImageFile?: File | null) => {
    if (!user) return

    try {
      let profileImageUrl = data.profileImageUrl

      // Handle profile image upload
      if (profileImageFile) {
        const storageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}`)
        const uploadTask = uploadBytesResumable(storageRef, profileImageFile)
        const snapshot = await uploadTask
        profileImageUrl = await getDownloadURL(snapshot.ref)
      }

      // Update Firestore document
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        ...data,
        ...(profileImageUrl && { profileImageUrl }),
        updatedAt: new Date().toISOString(),
      })

      // Update local state
      setUserProfile((prev) => ({
        ...prev,
        ...data,
        profileImageUrl: profileImageUrl || prev?.profileImageUrl,
      }))

      // Update Firebase Auth profile if name is provided
      if (data.fullName) {
        await updateFirebaseProfile(user, {
          displayName: data.fullName,
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }
  
  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logOut,
    resetPassword,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
