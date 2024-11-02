import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

export default function ApiTest() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPokemon = async () => {
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error('Pokemon not found!');
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pokemon API Test</h1>

          {/* Search Form */}
          <div className="flex space-x-4 mb-8">
            <Input
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              placeholder="Enter Pokemon name..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && searchPokemon()}
            />
            <Button
              onClick={searchPokemon}
              disabled={loading || !pokemonName.trim()}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Pokemon Details */}
          {pokemon && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-6">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-32 h-32 bg-white rounded-lg shadow-md"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {pokemon.name}
                  </h2>
                  
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-500">Types:</h3>
                    <div className="flex space-x-2 mt-1">
                      {pokemon.types.map(({ type }) => (
                        <span
                          key={type.name}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Abilities:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pokemon.abilities.map(({ ability }) => (
                        <span
                          key={ability.name}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {ability.name.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Information */}
          <div className="mt-8 text-sm text-gray-500">
            <p>This demo uses the <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">PokeAPI</a> to demonstrate API handling in WebContainers.</p>
            <p className="mt-2">Try searching for Pokemon like "pikachu", "charizard", or "mewtwo"!</p>
          </div>
        </div>
      </div>
    </div>
  );
}