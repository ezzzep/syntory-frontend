import React from "react";

export function Table({
  children,
  className,
}: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={className}>{children}</table>;
}

export function TableHeader({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className}>{children}</thead>;
}

export function TableBody({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  children,
  className,
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className}>{children}</tr>;
}

export function TableHead({
  children,
  className,
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={className}>{children}</th>;
}

export function TableCell({
  children,
  className,
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={className}>{children}</td>;
}
