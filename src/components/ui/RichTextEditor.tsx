"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolBtnProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}

function ToolBtn({ active, onClick, children, title }: ToolBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors",
        active
          ? "bg-[#068ec5] text-white"
          : "text-[#64748b] hover:bg-[#068ec5]/10 hover:text-[#068ec5]"
      )}
    >
      {children}
    </button>
  );
}

const fontSizeOptions = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "18px" },
  { label: "Huge", value: "24px" },
];

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis artikel di sini...",
}: EditorProps) {
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
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

  const setFontSize = useCallback(
    (size: string) => {
      if (editor) {
        editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
      }
      setShowFontSize(false);
    },
    [editor]
  );

  const setColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
      }
      setShowColor(false);
    },
    [editor]
  );

  const setHighlight = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().toggleHighlight({ color }).run();
      }
      setShowHighlight(false);
    },
    [editor]
  );

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL tautan:", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

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

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e2e8f0] bg-[#fafcfe] px-3 py-2">
        {/* Font Size */}
        <div className="relative">
          <ToolBtn
            active={false}
            onClick={() => {
              setShowFontSize(!showFontSize);
              setShowColor(false);
              setShowHighlight(false);
            }}
            title="Font Size"
          >
            <Type className="h-4 w-4" />
          </ToolBtn>
          {showFontSize && (
            <div className="absolute left-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
              {fontSizeOptions.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setFontSize(size.value)}
                  className="block w-full px-4 py-2 text-left text-sm text-[#1a1a2e] hover:bg-[#068ec5]/10"
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Text Formatting */}
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>

        {/* Color & Highlight */}
        <div className="relative">
          <ToolBtn
            active={false}
            onClick={() => {
              setShowColor(!showColor);
              setShowFontSize(false);
              setShowHighlight(false);
            }}
            title="Text Color"
          >
            <Palette className="h-4 w-4" />
          </ToolBtn>
          {showColor && (
            <div className="absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-lg">
              <p className="mb-2 text-xs font-medium text-[#64748b]">Text Color</p>
              <div className="grid grid-cols-5 gap-1">
                {[
                  "#000000",
                  "#dc2626",
                  "#ea580c",
                  "#ca8a04",
                  "#16a34a",
                  "#0284c7",
                  "#9333ea",
                  "#e11d48",
                  "#64748b",
                  "#f97316",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColor(color)}
                    className="h-6 w-6 rounded border border-[#e2e8f0] transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Headings */}
        <ToolBtn
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Lists */}
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Alignment */}
        <ToolBtn
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Link & Media */}
        <ToolBtn
          active={editor.isActive("link")}
          onClick={addLink}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={false} onClick={addImage} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
