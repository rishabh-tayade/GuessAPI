"use client"

import { useState, FormEvent } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

interface AgeResponse {
  age: number;
}

interface GenderResponse {
  gender: string;
}

interface CountryResponse {
  country: { country_id: string }[];
}

export default function Home() {
  const [name, setName] = useState<string>('');
  const [result, setResult] = useState<{ age: number; gender: string; country: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const [ageRes, genderRes, countryRes] = await Promise.all([
        axios.get<AgeResponse>(`https://api.agify.io?name=${name}`),
        axios.get<GenderResponse>(`https://api.genderize.io?name=${name}`),
        axios.get<CountryResponse>(`https://api.nationalize.io?name=${name}`),
      ]);

      setResult({
        age: ageRes.data.age,
        gender: genderRes.data.gender,
        country: countryRes.data.country[0].country_id,
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 border border-gray-300"
          placeholder="Enter your name"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Guess
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <p>Age: {result.age}</p>
          <p>Gender: {result.gender}</p>
          <p>Country: {result.country}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}