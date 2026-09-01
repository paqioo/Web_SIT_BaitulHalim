"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useCallback, useState } from "react";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextHOne,
  TextHTwo,
  ListBullets,
  ListNumbers,
  Quotes,
  AlignLeft,
  AlignCenterHorizontalSimple,
  AlignRight,
  LinkSimple,
  ImageSquare,
  TextStrikethrough,
  TextAa,
  PaintBrush,
  Resize,
} from "@phosphor-icons/react";
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

const fonts = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
];

const fontSizeOptions = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "24px", value: "24px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
];

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis artikel di sini...",
}: EditorProps) {
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState("#000000");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      FontFamily,
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

  const setFontFamily = useCallback(
    (font: string) => {
      if (editor) {
        editor.chain().focus().setFontFamily(font).run();
      }
      setShowFontFamily(false);
    },
    [editor]
  );

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
        {/* Font Family Dropdown */}
        <div className="relative">
          <ToolBtn
            active={false}
            onClick={() => {
              setShowFontFamily(!showFontFamily);
              setShowFontSize(false);
              setShowColor(false);
            }}
            title="Font Family"
          >
            <TextAa size={16} weight="bold" />
          </ToolBtn>
          {showFontFamily && (
            <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => setFontFamily(font.value)}
                  className="block w-full px-4 py-2 text-left text-sm text-[#1a1a2e] hover:bg-[#068ec5]/10"
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <ToolBtn
            active={false}
            onClick={() => {
              setShowFontSize(!showFontSize);
              setShowFontFamily(false);
              setShowColor(false);
            }}
            title="Font Size"
          >
            <Resize size={16} weight="bold" />
          </ToolBtn>
          {showFontSize && (
            <div className="absolute left-0 top-full z-50 mt-1 w-24 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
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
          title="Bold (Ctrl+B)"
        >
          <TextB size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <TextItalic size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <TextUnderline size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <TextStrikethrough size={16} weight="bold" />
        </ToolBtn>

        {/* Text Color */}
        <div className="relative">
          <ToolBtn
            active={false}
            onClick={() => {
              setShowColor(!showColor);
              setShowFontFamily(false);
              setShowFontSize(false);
            }}
            title="Text Color"
          >
            <PaintBrush size={16} weight="bold" />
          </ToolBtn>
          {showColor && (
            <div className="absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-lg">
              <div className="grid grid-cols-5 gap-1">
                {[
                  "#000000",
                  "#434343",
                  "#666666",
                  "#999999",
                  "#b7b7b7",
                  "#ff0000",
                  "#ff9900",
                  "#ffff00",
                  "#00ff00",
                  "#00ffff",
                  "#0000ff",
                  "#9900ff",
                  "#ff00ff",
                  "#ff6600",
                  "#068ec5",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColor(color)}
                    className="h-6 w-6 rounded border border-[#e2e8f0] hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-2 border-t border-[#e2e8f0] pt-2">
                <input
                  type="color"
                  value={colorPickerColor}
                  onChange={(e) => setColorPickerColor(e.target.value)}
                  className="h-8 w-full cursor-pointer rounded"
                />
                <button
                  type="button"
                  onClick={() => setColor(colorPickerColor)}
                  className="mt-1 w-full rounded bg-[#068ec5] py-1 text-xs text-white hover:bg-[#0577a3]"
                >
                  Apply Custom
                </button>
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
          <TextHOne size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <TextHTwo size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Lists */}
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <ListBullets size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListNumbers size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quotes size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Alignment */}
        <ToolBtn
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenterHorizontalSimple size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight size={16} weight="bold" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-[#e2e8f0]" />

        {/* Link & Media */}
        <ToolBtn
          active={editor.isActive("link")}
          onClick={addLink}
          title="Add Link"
        >
          <LinkSimple size={16} weight="bold" />
        </ToolBtn>
        <ToolBtn
          active={false}
          onClick={addImage}
          title="Insert Image"
        >
          <ImageSquare size={16} weight="bold" />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
