import React from "react";

// Table
export function Table({
  children,
  className,
}: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={className}>{children}</table>;
}

// TableHeader
export function TableHeader({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className}>{children}</thead>;
}

// TableBody
export function TableBody({
  children,
  className,
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className}>{children}</tbody>;
}

// TableRow
export function TableRow({
  children,
  className,
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className}>{children}</tr>;
}

// TableHead
export function TableHead({
  children,
  className,
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={className}>{children}</th>;
}

// TableCell
export function TableCell({
  children,
  className,
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={className}>{children}</td>;
}
