"use client";
import "regenerator-runtime/runtime";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}
