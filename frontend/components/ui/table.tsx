import { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return <div className="overflow-x-auto rounded-2xl border border-border/40"><table className="w-full border-collapse text-sm text-text/90">{children}</table></div>;
}

export function TableHeader({ children }: PropsWithChildren) {
  return <thead className="bg-gradient-to-r from-surface/60 to-surface/40 text-left text-text/80 sticky top-0 border-b border-border/50">{children}</thead>;
}

export function TableBody({ children }: PropsWithChildren) {
  return <tbody className="[&_tr:nth-child(even)]:bg-surface/20">{children}</tbody>;
}

export function TableRow({ children }: PropsWithChildren) {
  return <tr className="border-b border-border/30 last:border-0 hover:bg-primary-light/10 transition-colors duration-200 cursor-pointer">{children}</tr>;
}

export function TableHead({ children }: PropsWithChildren) {
  return <th className="px-6 py-4 font-bold text-xs uppercase tracking-[0.06em] text-text/70 text-left">{children}</th>;
}

export function TableCell({ children }: PropsWithChildren) {
  return <td className="px-6 py-4 align-middle text-sm">{children}</td>;
}

