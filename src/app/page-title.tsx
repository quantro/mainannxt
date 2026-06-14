"use client";

import { useEffect } from "react";

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title + " - Fun Tools";
  }, [title]);
  return null;
}
