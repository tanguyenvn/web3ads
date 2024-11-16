"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Ad } from "../utils/interface";

export default function Page() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [formData, setFormData] = useState({
    owner: "",
    chain_id: "0x1",
    cost_per_ad: 0,
    url: "",
    type: "image",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(formData);
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad');
      }

      const data = await response.json();
      console.log('Success:', data);
      
      // Refresh the ads list after successful submission
      fetchAds();
      
      // Clear form
      setFormData({
        owner: '',
        chain_id: '0x1',
        cost_per_ad: 0,
        url: '',
        type: 'image',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create ad');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1>Hello, Dashboard!</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="owner" className="block mb-2">Owner</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="chainId" className="block mb-2">Chain ID</label>
          <select
            id="chainId"
            name="chainId"
            value={formData.chain_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="0x1">0x1</option>
            <option value="0x2">0x2</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block mb-2">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label htmlFor="url" className="block mb-2">URL</label>
          <textarea
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="cost_per_ad" className="block mb-2">Cost Per Ad</label>
          <textarea
            id="cost_per_ad"
            name="cost_per_ad"
            value={formData.cost_per_ad}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <Button type="submit">Create Ad</Button>
      </form>

      <hr className="my-8" />
      <h2 className="text-2xl font-bold mb-4">List Ads</h2>
      
      <div className="grid gap-4">
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className="p-4 border rounded-lg shadow-sm"
          >
            <div className="mt-2 text-sm text-gray-500">
              <span className="mr-4">{ad.owner}</span>
              <span className="mr-4">Chain ID: {ad.chain_id}</span>
              <span className="mr-4">Cost per ad: {ad.cost_per_ad}</span>
              <span>Created: {new Date(ad.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        
        {ads.length === 0 && (
          <p className="text-gray-500">No ads found.</p>
        )}
      </div>
    </>
  );
}