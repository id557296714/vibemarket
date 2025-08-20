"use client";

import { useMemo, useState, useEffect } from "react";
import listingsData from "../../data/listings.json";

type Listing = {
  id: number;
  title: string;
  description: string;
  price: string;     // e.g. "5 USD/kg", "12 USD/jar"
  provider: string;
  category: string;
  image: string;
};

// Extract the first number found in a price string (e.g., "18 USD/500g" -> 18)
// If there are multiple numbers (like "20 USD/5kg"), we still sort by the *first* one.
function parsePriceNumber(price: string): number {
  const m = price.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");

  useEffect(() => {
    setListings(listingsData as Listing[]);
  }, []);

  // Build category list from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    (listingsData as Listing[]).forEach((l) => set.add(l.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filter + Sort
  const visible = useMemo(() => {
    const q = query.toLowerCase();

    let arr = (listings as Listing[]).filter((l) => {
      const matchesText =
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.provider.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q);

      const matchesCategory = category === "All" || l.category === category;

      return matchesText && matchesCategory;
    });

    if (priceSort !== "none") {
      arr = arr.slice().sort((a, b) => {
        const pa = parsePriceNumber(a.price);
        const pb = parsePriceNumber(b.price);
        return priceSort === "asc" ? pa - pb : pb - pa;
      });
    }

    return arr;
  }, [listings, query, category, priceSort]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          VibeMarket — Browse Listings
        </h1>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Sort by price */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by price:</span>
            <div className="inline-flex rounded-lg overflow-hidden border">
              <button
                className={`px-3 py-2 text-sm ${
                  priceSort === "none" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setPriceSort("none")}
              >
                None
              </button>
              <button
                className={`px-3 py-2 text-sm border-l ${
                  priceSort === "asc" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setPriceSort("asc")}
              >
                ↑ Asc
              </button>
              <button
                className={`px-3 py-2 text-sm border-l ${
                  priceSort === "desc" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setPriceSort("desc")}
              >
                ↓ Desc
              </button>
            </div>
          </div>
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Row-style cards */}
        <div className="space-y-4">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              style={{ minHeight: "120px" }}
            >
              {/* Left: thumbnail spans row height */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-32 object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />

              {/* Middle: info */}
              <div className="flex-1 min-w-0 p-4">
                <div className="flex items-start gap-2">
                  <h2 className="text-lg font-semibold truncate">
                    {item.title}
                  </h2>
                  <span className="ml-auto hidden sm:inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">by {item.provider}</p>
                {/* Category badge shown on small screens below */}
                <span className="inline-block sm:hidden mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {item.category}
                </span>
              </div>

              {/* Right: price */}
              <div className="p-4 pl-0 self-stretch flex items-center justify-end">
                <div className="text-xl font-semibold whitespace-nowrap">
                  {item.price}
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <p className="text-gray-500">No listings match your filters.</p>
          )}
        </div>
      </div>
    </main>
  );
}