"use client";

import { topListCards as s } from "@/styles/topListCards";

export default function TopListsCards() {
  const topOrders = [
    "John Doe",
    "Johnny Bravo",
    "John Cena",
    "Bruce Wayne",
    "Clark Kent",
  ];
  const topSuppliers = [
    "Supplier A",
    "Supplier B",
    "Supplier C",
    "Supplier D",
    "Supplier E",
  ];
  const ordersOverview = [
    { label: "Completed", value: 431 },
    { label: "Pending", value: 92 },
    { label: "Cancelled", value: 17 },
  ];

  return (
    <div className={s.grid}>
      {/* Top Orders */}
      <div className={s.card}>
        <h2 className={s.title}>Top Orders</h2>
        {topOrders.map((name, i) => (
          <p key={i} className={s.listItem}>
            {i + 1}. {name}
          </p>
        ))}
      </div>

      {/* Top Suppliers */}
      <div className={s.card}>
        <h2 className={s.title}>Top Suppliers</h2>
        {topSuppliers.map((supply, i) => (
          <p key={i} className={s.listItem}>
            {i + 1}. {supply}
          </p>
        ))}
      </div>

      {/* Orders Overview */}
      <div className={s.card}>
        <h2 className={s.title}>Orders Overview</h2>
        {ordersOverview.map((item, i) => (
          <p key={i} className={s.listItem}>
            {item.label}: {item.value}
          </p>
        ))}
      </div>
    </div>
  );
}
