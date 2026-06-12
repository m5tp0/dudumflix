import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, ArrowLeft, Camera, User as UserIcon, Check } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { updateProfile, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AVATARS = [
  "/avatars/boy.png",
  "/avatars/girl.png"
];

// Helper to resize image and convert to Base64 to save space
const resizeImageToBase64 = (file: File, maxWidth = 256, maxHeight = 256): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG to save maximum space in LocalStorage/Firestore
        resolve(canvas.toDataURL("image/jpeg", 0.8)); 
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATARS[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUsername(user.displayName || "");
        setEmail(user.email || "");
        
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.username || user.displayName || "");
            setAvatarUrl(data.avatar_url || user.photoURL || AVATARS[0]);
          } else {
            setAvatarUrl(user.photoURL || AVATARS[0]);
          }
        } catch (err) {
          console.error("Error loading profile from database:", err);
          toast.error("Failed to load profile data");
          setAvatarUrl(user.photoURL || AVATARS[0]);
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    // Create local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    setAvatarUrl(url); // Temporarily set avatarUrl to preview
    toast.success("Identity asset loaded. Confirm to save.");
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // If a new file was selected, process it locally
      if (selectedFile) {
        try {
          // Resize the image so it fits easily in LocalStorage and Firestore
          finalAvatarUrl = await resizeImageToBase64(selectedFile);
        } catch (e) {
          console.error("Failed to process image:", e);
          throw new Error("Failed to process image locally.");
        }
      }

      const authUpdates: any = { displayName: username };
      
      // Firebase Auth restricts photoURL to ~2048 characters.
      // Large Base64 images will crash it. So we only update Auth photoURL if it's a short path.
      // The massive Base64 string will still be safely saved in Firestore!
      if (finalAvatarUrl.length < 2000) {
        authUpdates.photoURL = finalAvatarUrl;
      }

      await updateProfile(user, authUpdates);

      const docRef = doc(db, "users", user.uid);
      // Use setDoc with merge: true instead of updateDoc!
      // updateDoc will fail with "Missing or insufficient permissions" if the document doesn't exist yet.
      await setDoc(docRef, {
        username: username,
        avatar_url: finalAvatarUrl,
        uid: user.uid,
        updated_at: new Date().toISOString()
      }, { merge: true });

      // Update local storage
      const activeProfile = localStorage.getItem("velora_active_profile");
      if (activeProfile) {
        const parsed = JSON.parse(activeProfile);
        localStorage.setItem("velora_active_profile", JSON.stringify({
          ...parsed,
          username: username,
          avatar_url: finalAvatarUrl
        }));
      }

      // Cleanup
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setAvatarUrl(finalAvatarUrl);

      toast.success("Neural Identity Synchronized!");
    } catch (err: any) {
      console.error("Full Save Error:", err);
      // Let the user know if their Firestore rules are broken
      if (err.message && err.message.includes("Missing or insufficient permissions")) {
         toast.error("Database Error: Please update your Firestore Rules to allow writes.", { duration: 8000 });
      } else {
         toast.error(err.message || "Unknown error occurred during save");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("velora_active_profile");
      toast.success("Connection Terminated");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="mx-auto w-full max-w-lg">
        <button
          onClick={() => navigate("/home")}
          className="mb-4 flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
          <h1 className="mb-6 font-heading text-xl font-bold text-foreground">Neural Identity</h1>

          <div className="mb-6">
            <label className="mb-2 block font-heading text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Username</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Identity Name"
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-12 pr-4 font-body text-sm text-white placeholder:text-white/10 transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-heading text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural Link Address (Email)</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-4 w-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                type="text"
                value={email}
                disabled
                className="w-full rounded-xl border border-white/5 bg-white/[0.01] py-3 pl-12 pr-4 font-body text-sm text-white/40 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-4 block font-heading text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Avatar Matrix</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-wrap gap-4 justify-center max-h-[220px] overflow-y-auto scrollbar-hide p-1">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 transition-all ${
                  selectedFile ? "border-primary bg-primary/10" : "border-dashed border-white/10 bg-white/5 hover:border-primary"
                }`}
              >
                {selectedFile ? <Check className="h-5 w-5 text-primary" /> : <Camera className="h-5 w-5 text-white/40" />}
                <span className="mt-1 text-[7px] uppercase font-bold text-white/40">{selectedFile ? "Selected" : "Upload"}</span>
              </button>

              {/* Current/Preview Selection - ALWAYS SHOW */}
              <div className="relative">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary scale-110 shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                  <img 
                    src={previewUrl || avatarUrl} 
                    alt="Current Selection" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/avatars/boy.png";
                    }}
                  />
                </div>
                <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 shadow-lg">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Preset Options */}
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => {
                    setAvatarUrl(av);
                    setSelectedFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                  className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                    avatarUrl === av && !selectedFile
                      ? "border-primary scale-105 shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                      : "border-border/30 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={av} alt="avatar" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-heading text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Syncing..." : "Confirm Identity"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-heading text-xs font-black uppercase tracking-widest text-white/40 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
