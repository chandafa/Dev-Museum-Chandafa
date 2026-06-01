"use client";

import { useEffect } from "react";

const blockedKeys = new Set(["F12"]);

function isProtectedShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const ctrlOrCmd = event.ctrlKey || event.metaKey;

  if (blockedKeys.has(event.key)) return true;
  if (ctrlOrCmd && key === "u") return true;
  if (ctrlOrCmd && key === "s") return true;
  if (ctrlOrCmd && event.shiftKey && ["i", "j", "c"].includes(key)) return true;

  return false;
}

export function InteractionGuard() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventShortcut = (event: KeyboardEvent) => {
      if (!isProtectedShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const preventDrag = (event: DragEvent) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventShortcut, true);
    document.addEventListener("dragstart", preventDrag);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventShortcut, true);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  return null;
}
