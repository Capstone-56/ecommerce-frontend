"use client";
import { useEffect, useState } from "react";

export default function ApiTest() {
  const url = "https://pokeapi.co/api/v2/pokemon/gengar";
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    // fetch data
    fetch(url).then((response) =>
      response.json().then((data) => setPokemon(data.name))
    );
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Your pokemon is: {pokemon}</h1>
    </div>
  );
}
