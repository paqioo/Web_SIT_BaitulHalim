"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextHTwo,
  ListBullets,
  ListNumbers,
  Quotes,
  AlignLeft,
  AlignCenterHorizontalSimple,
  AlignRight,
  LinkSimple,
  ImageSquare,
} from "@phosphor-icons/react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis artikel di sini...",
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-4",
      },
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        } else {
          alert(data.error || "Gagal upload gambar.");
        }
      } catch {
        alert("Gagal upload gambar.");
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Masukkan URL tautan:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({
    active,
    onClick,
    children,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active
          ? "bg-[#068ec5] text-white"
          : "text-[#64748b] hover:bg-[#068ec5]/10 hover:text-[#068ec5]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e2e8f0] bg-[#fafcfe] px-3 py-2">
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextB size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <TextUnderline size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TextHTwo size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        <ToolBtn
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenterHorizontalSimple size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        <ToolBtn active={false} onClick={addLink}>
          <LinkSimple size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn active={false} onClick={addImage}>
          <ImageSquare size={16} weight="bold" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
