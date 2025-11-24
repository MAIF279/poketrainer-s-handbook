import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, Package, Search, User } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    teamCount: 0,
    boxCount: 0,
    totalPokemons: 0,
  });
  const [trainer, setTrainer] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Get first trainer (for demo purposes)
    const { data: trainers } = await supabase
      .from("trainers")
      .select("*")
      .limit(1)
      .single();
    
    if (trainers) {
      setTrainer(trainers);
      
      // Get team count
      const { count: teamCount } = await supabase
        .from("trainer_pokemons")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainers.id)
        .eq("location", "team");
      
      // Get box count
      const { count: boxCount } = await supabase
        .from("trainer_pokemons")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainers.id)
        .eq("location", "box");
      
      // Get total available pokemons
      const { count: totalPokemons } = await supabase
        .from("pokemons")
        .select("*", { count: "exact", head: true });
      
      setStats({
        teamCount: teamCount || 0,
        boxCount: boxCount || 0,
        totalPokemons: totalPokemons || 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary p-8 md:p-12 mb-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bem-vindo ao PokeAgenda
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              Gerencie sua coleção de Pokémon como um verdadeiro treinador!
            </p>
            {trainer ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  {trainer.photo_url ? (
                    <img
                      src={trainer.photo_url}
                      alt={trainer.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{trainer.name}</p>
                  <p className="text-sm opacity-80">{trainer.city}</p>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/profile")}
                variant="secondary"
                size="lg"
              >
                Criar Perfil de Treinador
              </Button>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Atual</p>
                <p className="text-3xl font-bold text-primary">{stats.teamCount}/6</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">No Box</p>
                <p className="text-3xl font-bold text-accent">{stats.boxCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pokédex</p>
                <p className="text-3xl font-bold text-secondary">{stats.totalPokemons}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <User className="w-8 h-8" />
              <span>Ver Perfil</span>
            </Button>
            
            <Button
              onClick={() => navigate("/team")}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <Users className="w-8 h-8" />
              <span>Gerenciar Time</span>
            </Button>
            
            <Button
              onClick={() => navigate("/box")}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <Package className="w-8 h-8" />
              <span>Ver Box</span>
            </Button>
            
            <Button
              onClick={() => navigate("/search")}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
            >
              <Search className="w-8 h-8" />
              <span>Buscar Pokémon</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
