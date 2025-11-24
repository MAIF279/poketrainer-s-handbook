import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PokemonCardProps {
  name: string;
  pokedexNumber: number;
  type1: string;
  type2?: string | null;
  imageUrl: string;
  nickname?: string | null;
  onClick?: () => void;
}

const getTypeColor = (type: string): string => {
  const typeMap: Record<string, string> = {
    Fire: "bg-type-fire",
    Water: "bg-type-water",
    Grass: "bg-type-grass",
    Electric: "bg-type-electric",
    Psychic: "bg-type-psychic",
    Normal: "bg-type-normal",
    Fighting: "bg-type-fighting",
    Flying: "bg-type-flying",
    Poison: "bg-type-poison",
    Ground: "bg-type-ground",
    Rock: "bg-type-rock",
    Bug: "bg-type-bug",
    Ghost: "bg-type-ghost",
    Steel: "bg-type-steel",
    Dragon: "bg-type-dragon",
    Dark: "bg-type-dark",
    Fairy: "bg-type-fairy",
    Ice: "bg-type-ice",
  };
  return typeMap[type] || "bg-muted";
};

export const PokemonCard = ({
  name,
  pokedexNumber,
  type1,
  type2,
  imageUrl,
  nickname,
  onClick,
}: PokemonCardProps) => {
  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 text-xs font-bold text-muted-foreground">
        #{String(pokedexNumber).padStart(3, "0")}
      </div>
      
      <div className="p-4 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-3">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="text-center space-y-2 w-full">
          {nickname && (
            <p className="text-sm font-medium text-primary italic">"{nickname}"</p>
          )}
          <h3 className="text-lg font-bold">{name}</h3>
          
          <div className="flex gap-1 justify-center flex-wrap">
            <Badge className={`${getTypeColor(type1)} text-white border-0`}>
              {type1}
            </Badge>
            {type2 && (
              <Badge className={`${getTypeColor(type2)} text-white border-0`}>
                {type2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
