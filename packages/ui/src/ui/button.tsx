import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-md bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500 ${props.className ?? ""}`.trim()}
    />
  );
}
