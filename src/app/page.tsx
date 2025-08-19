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

        <input
          type="text"
          placeholder="Search listings..."
          className="w-full mb-8 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;       // prevent loop
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="mt-2 font-medium">{item.price}</p>
                <p className="text-sm text-gray-500">by {item.provider}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {item.category}
                </span>
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