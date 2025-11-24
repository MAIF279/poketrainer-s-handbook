import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PokemonCard } from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Team() {
  const navigate = useNavigate();
  const [teamPokemons, setTeamPokemons] = useState<any[]>([]);
  const [trainer, setTrainer] = useState<any>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [actionType, setActionType] = useState<"move" | "delete" | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

    setTrainer(trainerData);

    const { data } = await supabase
      .from("trainer_pokemons")
      .select(`
        *,
        pokemons (*)
      `)
      .eq("trainer_id", trainerData.id)
      .eq("location", "team");

    setTeamPokemons(data || []);
  };

  const handleMoveToBox = async () => {
    if (!selectedPokemon) return;

    const { error } = await supabase
      .from("trainer_pokemons")
      .update({ location: "box" })
      .eq("id", selectedPokemon.id);

    if (error) {
      toast.error("Erro ao mover Pokémon");
      return;
    }

    toast.success("Pokémon movido para o Box!");
    setSelectedPokemon(null);
    setActionType(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedPokemon) return;

    const { error } = await supabase
      .from("trainer_pokemons")
      .delete()
      .eq("id", selectedPokemon.id);

    if (error) {
      toast.error("Erro ao remover Pokémon");
      return;
    }

    toast.success("Pokémon removido!");
    setSelectedPokemon(null);
    setActionType(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meu Time</h1>
            <p className="text-muted-foreground">
              {teamPokemons.length}/6 Pokémons no time
            </p>
          </div>
          {teamPokemons.length < 6 && (
            <Button onClick={() => navigate("/search")}>
              Adicionar Pokémon
            </Button>
          )}
        </div>

        {teamPokemons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              Seu time está vazio!
            </p>
            <Button onClick={() => navigate("/search")}>
              Buscar Pokémons
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {teamPokemons.map((tp) => (
              <div key={tp.id} className="relative group">
                <PokemonCard
                  name={tp.pokemons.name}
                  pokedexNumber={tp.pokemons.pokedex_number}
                  type1={tp.pokemons.type1}
                  type2={tp.pokemons.type2}
                  imageUrl={tp.pokemons.image_url}
                  nickname={tp.nickname}
                />
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedPokemon(tp);
                      setActionType("move");
                    }}
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedPokemon(tp);
                      setActionType("delete");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={actionType === "move"} onOpenChange={() => setActionType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mover para o Box?</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja mover {selectedPokemon?.nickname || selectedPokemon?.pokemons?.name} para o Box?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleMoveToBox}>Mover</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={actionType === "delete"} onOpenChange={() => setActionType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Pokémon?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover {selectedPokemon?.nickname || selectedPokemon?.pokemons?.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
