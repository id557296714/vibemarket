"use client";

import { useState, useEffect } from "react";
import listingsData from "../../data/listings.json";

type Listing = {
  id: number;
  title: string;
  description: string;
  price: string;
  provider: string;
  category: string;
  image: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(listingsData as Listing[]);
  }, []);

  const filtered = listings.filter((l) => {
    const q = query.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.provider.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          VibeMarket — Browse Listings
        </h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full mb-8 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Row-style cards */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
            >
              {/* Left: thumbnail */}
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-28 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.jpg"; // optional fallback
                }}
              />

              {/* Middle: info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">{item.title}</h2>
                <p className="text-gray-600 text-sm overflow-hidden text-ellipsis">
                  {item.description}
                </p>
                <p className="text-sm text-gray-500">by {item.provider}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {item.category}
                </span>
              </div>

              {/* Right: price */}
              <div className="text-right whitespace-nowrap pl-4 self-start sm:self-center">
                <div className="text-xl font-semibold">{item.price}</div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500">No listings match your search.</p>
          )}
        </div>
      </div>
    </main>
  );
}