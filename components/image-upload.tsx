"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Camera } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploadProps {
  value: string | File | null
  onChange: (file: File | string | null) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  )
  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value)
    } else if (value instanceof File) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onChange(file)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  })

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-accent"
        >
          <Image 
            src={preview} 
            alt="Profile preview" 
            fill 
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragActive ? "border-accent bg-accent/10" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <Camera className="h-8 w-8 text-accent" />
            </div>
            <p className="mb-1 font-medium text-accent">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground">or click to select a file</p>
            <p className="mt-2 text-xs text-muted-foreground">Max file size: 5MB</p>
          </motion.div>
        </div>
      )}
    </div>
  )
}