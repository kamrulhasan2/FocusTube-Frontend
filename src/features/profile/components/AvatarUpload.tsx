"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/use-auth-store";
import { useShallow } from "zustand/react/shallow";
import { useUploadAvatar } from "../hooks/use-profile-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const getInitials = (name?: string) => {
  if (!name) return "FT";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function AvatarUpload() {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const uploadAvatar = useUploadAvatar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const initials = useMemo(() => getInitials(user?.name), [user?.name]);
  const activeAvatar = previewUrl || user?.avatar || "";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (uploadAvatar.isSuccess && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFileName(null);
      resetInput();
    }
  }, [previewUrl, uploadAvatar.isSuccess]);

  useEffect(() => {
    if (uploadAvatar.isError && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFileName(null);
      resetInput();
      uploadAvatar.reset();
    }
  }, [previewUrl, uploadAvatar, uploadAvatar.isError]);

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 2MB.");
      return false;
    }
  return true;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateFile(file)) {
        resetInput();
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      uploadAvatar.reset();
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFileName(file.name);

      void readFileAsDataUrl(file)
        .then((avatar) => {
          uploadAvatar.mutate({ file, previewUrl: objectUrl, avatar });
        })
        .catch(() => {
          toast.error("Unable to process image. Please try another file.");
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
          setPreviewUrl(null);
          setFileName(null);
          resetInput();
        });
    },
    [previewUrl, uploadAvatar],
  );

  const triggerFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Profile Photo</h2>
          <p className="text-sm text-slate-400">
            Upload a crisp square image to personalize your workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative w-fit">
          <div className="group relative">
            <Avatar className="h-24 w-24 border border-white/10 bg-slate-900">
              {activeAvatar ? (
                <AvatarImage
                  src={activeAvatar}
                  alt={user?.name ?? "User avatar"}
                  className="object-cover transition-opacity duration-200"
                />
              ) : null}
              <AvatarFallback className="text-lg">
                {initials || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={triggerFileDialog}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-label="Change profile photo"
            >
              Change
            </button>

            {uploadAvatar.isPending ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Choose a new photo</p>
            <p className="text-xs text-slate-500">
              PNG, JPG, or WEBP up to 2MB. {fileName ? `Selected: ${fileName}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={triggerFileDialog}>
              {uploadAvatar.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Change photo
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "border border-white/10",
                (!previewUrl || uploadAvatar.isPending) && "opacity-60",
              )}
              onClick={() => {
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(null);
                setFileName(null);
                resetInput();
              }}
              disabled={!previewUrl || uploadAvatar.isPending}
            >
              Remove preview
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload avatar"
      />
    </section>
  );
}
