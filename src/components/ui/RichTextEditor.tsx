"use client";

import { useState } from "react";
import type { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis artikel di sini...",
}: RichTextEditorProps) {
  const [value, setValue] = useState<Content>(content);

  const handleChange = (newValue: Content) => {
    setValue(newValue);
    if (typeof newValue === "string") {
      onChange(newValue);
    }
  };

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      editorContentClassName="p-4"
    />
  );
}
