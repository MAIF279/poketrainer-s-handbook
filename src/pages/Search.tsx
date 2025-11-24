import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [nickname, setNickname] = useState("");

  const searchPokemon = async () => {
    if (!searchTerm) {
      toast.error("Digite um nome ou número");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      
      if (!response.ok) {
        toast.error("Pokémon não encontrado!");
        setPokemonData(null);
        return;
      }

      const data = await response.json();
      
      // Get species data for evolution chain
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      
      setPokemonData({
        name: data.name,
        id: data.id,
        types: data.types.map((t: any) => t.type.name),
        sprite: data.sprites.other["official-artwork"].front_default,
        height: data.height / 10,
        weight: data.weight / 10,
        abilities: data.abilities.map((a: any) => a.ability.name),
        evolutionChainUrl: speciesData.evolution_chain.url,
      });
    } catch (error) {
      toast.error("Erro ao buscar Pokémon");
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPokemon = async () => {
    const { data: trainerData } = await supabase
      .from("trainers")
      .select("*")
      .limit(1)
      .single();

    if (!trainerData) {
      toast.error("Crie seu perfil primeiro!");
      navigate("/profile");
      return;
    }

    // Check if pokemon exists in database
    let { data: existingPokemon } = await supabase
      .from("pokemons")
      .select("*")
      .eq("pokedex_number", pokemonData.id)
      .single();

    // If not, create it
    if (!existingPokemon) {
      const { data: newPokemon, error: pokemonError } = await supabase
        .from("pokemons")
        .insert([
          {
            name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
            pokedex_number: pokemonData.id,
            type1: pokemonData.types[0].charAt(0).toUpperCase() + pokemonData.types[0].slice(1),
            type2: pokemonData.types[1]
              ? pokemonData.types[1].charAt(0).toUpperCase() + pokemonData.types[1].slice(1)
              : null,
            image_url: pokemonData.sprite,
            height: pokemonData.height,
            weight: pokemonData.weight,
            abilities: pokemonData.abilities,
          },
        ])
        .select()
        .single();

      if (pokemonError) {
        toast.error("Erro ao adicionar Pokémon");
        return;
      }
      existingPokemon = newPokemon;
    }

    // Check team count
    const { count: teamCount } = await supabase
      .from("trainer_pokemons")
      .select("*", { count: "exact", head: true })
      .eq("trainer_id", trainerData.id)
      .eq("location", "team");

    const location = (teamCount || 0) < 6 ? "team" : "box";

    const { error } = await supabase.from("trainer_pokemons").insert([
      {
        trainer_id: trainerData.id,
        pokemon_id: existingPokemon.id,
        location,
        nickname: nickname || null,
      },
    ]);

    if (error) {
      toast.error("Erro ao adicionar Pokémon");
      return;
    }

    toast.success(
      location === "team"
        ? "Pokémon adicionado ao time!"
        : "Time completo! Pokémon adicionado ao Box."
    );
    
    setShowAddDialog(false);
    setNickname("");
    setPokemonData(null);
    setSearchTerm("");
  };

  const getTypeColor = (type: string): string => {
    const typeMap: Record<string, string> = {
      fire: "bg-type-fire",
      water: "bg-type-water",
      grass: "bg-type-grass",
      electric: "bg-type-electric",
      psychic: "bg-type-psychic",
      normal: "bg-type-normal",
      fighting: "bg-type-fighting",
      flying: "bg-type-flying",
      poison: "bg-type-poison",
      ground: "bg-type-ground",
      rock: "bg-type-rock",
      bug: "bg-type-bug",
      ghost: "bg-type-ghost",
      steel: "bg-type-steel",
      dragon: "bg-type-dragon",
      dark: "bg-type-dark",
      fairy: "bg-type-fairy",
      ice: "bg-type-ice",
    };
    return typeMap[type] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Buscar Pokémon</h1>

        <Card className="p-6 mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome ou número do Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchPokemon()}
            />
            <Button onClick={searchPokemon} disabled={loading}>
              <SearchIcon className="w-4 h-4 mr-2" />
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </Card>

        {pokemonData && (
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={pokemonData.sprite}
                  alt={pokemonData.name}
                  className="w-64 h-64 object-contain mb-4"
                />
                <h2 className="text-3xl font-bold capitalize mb-2">
                  {pokemonData.name}
                </h2>
                <p className="text-muted-foreground mb-4">
                  #{String(pokemonData.id).padStart(3, "0")}
                </p>
                <div className="flex gap-2 mb-6">
                  {pokemonData.types.map((type: string) => (
                    <Badge
                      key={type}
                      className={`${getTypeColor(type)} text-white border-0 text-lg px-4 py-1`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
                <Button onClick={() => setShowAddDialog(true)} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar ao Time
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Informações</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Altura:</span>{" "}
                      {pokemonData.height} m
                    </p>
                    <p>
                      <span className="font-semibold">Peso:</span>{" "}
                      {pokemonData.weight} kg
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemonData.abilities.map((ability: string) => (
                      <Badge key={ability} variant="secondary" className="capitalize">
                        {ability.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Pokémon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nickname">Apelido (opcional)</Label>
                <Input
                  id="nickname"
                  placeholder="Digite um apelido..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPokemon}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
