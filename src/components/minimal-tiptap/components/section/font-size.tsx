import * as React from "react"
import type { Editor } from "@tiptap/react"
import type { toggleVariants } from "@/components/ui/toggle"
import type { VariantProps } from "class-variance-authority"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { ToolbarButton } from "../toolbar-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const FONT_SIZES = [
  { value: "8px", label: "8" },
  { value: "10px", label: "10" },
  { value: "12px", label: "12" },
  { value: "14px", label: "14" },
  { value: "16px", label: "16" },
  { value: "18px", label: "18" },
  { value: "20px", label: "20" },
  { value: "24px", label: "24" },
  { value: "28px", label: "28" },
  { value: "32px", label: "32" },
  { value: "36px", label: "36" },
  { value: "40px", label: "40" },
  { value: "48px", label: "48" },
]

interface FontSizeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const FontSizeSelector: React.FC<FontSizeProps> = ({
  editor,
  size,
  variant,
}) => {
  const currentSize = editor.getAttributes("textStyle")?.fontSize || "16px"

  const handleFontSize = React.useCallback(
    (fontSize: string) => {
      editor.chain().focus().setFontSize(fontSize).run()
    },
    [editor]
  )

  const displaySize = FONT_SIZES.find((fs) => fs.value === currentSize)?.label || "16"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          tooltip="Font size"
          aria-label="Font size"
          className="gap-0 min-w-12"
          size={size}
          variant={variant}
        >
          <span className="text-xs font-semibold">{displaySize}</span>
          <CaretDownIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-20">
        {FONT_SIZES.map((fs) => (
          <DropdownMenuItem
            key={fs.value}
            onClick={() => handleFontSize(fs.value)}
            className={currentSize === fs.value ? "bg-accent" : ""}
          >
            <span className="text-sm">{fs.label}px</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

FontSizeSelector.displayName = "FontSizeSelector"

export default FontSizeSelector
