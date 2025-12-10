import { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return <table className="w-full border-collapse text-sm text-foreground/90">{children}</table>;
}

export function TableHeader({ children }: PropsWithChildren) {
  return <thead className="bg-muted text-left text-foreground">{children}</thead>;
}

export function TableBody({ children }: PropsWithChildren) {
  return <tbody className="[&_tr:nth-child(even)]:bg-muted/40">{children}</tbody>;
}

export function TableRow({ children }: PropsWithChildren) {
  return <tr className="border-b border-border/70 last:border-0 hover:bg-primary/5 transition-colors">{children}</tr>;
}

export function TableHead({ children }: PropsWithChildren) {
  return <th className="px-4 py-3 font-semibold text-sm uppercase tracking-[0.04em] text-foreground/80">{children}</th>;
}

export function TableCell({ children }: PropsWithChildren) {
  return <td className="px-4 py-3 align-middle text-sm">{children}</td>;
}

