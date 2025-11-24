-- Create trainers table
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pokemons table (database of available pokemons)
CREATE TABLE public.pokemons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pokedex_number INTEGER UNIQUE NOT NULL,
  type1 TEXT NOT NULL,
  type2 TEXT,
  image_url TEXT NOT NULL,
  height DECIMAL NOT NULL,
  weight DECIMAL NOT NULL,
  abilities TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trainer_pokemons table (relationship between trainers and their captured pokemons)
CREATE TABLE public.trainer_pokemons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  pokemon_id UUID REFERENCES public.pokemons(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('team', 'box')),
  nickname TEXT,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pokemons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_pokemons ENABLE ROW LEVEL SECURITY;

-- Policies for trainers (everyone can view, only own trainer can update)
CREATE POLICY "Anyone can view trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Users can insert their trainer" ON public.trainers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their trainer" ON public.trainers FOR UPDATE USING (true);

-- Policies for pokemons (everyone can view)
CREATE POLICY "Anyone can view pokemons" ON public.pokemons FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pokemons" ON public.pokemons FOR INSERT WITH CHECK (true);

-- Policies for trainer_pokemons
CREATE POLICY "Anyone can view trainer pokemons" ON public.trainer_pokemons FOR SELECT USING (true);
CREATE POLICY "Users can manage their pokemons" ON public.trainer_pokemons FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their pokemons" ON public.trainer_pokemons FOR UPDATE USING (true);
CREATE POLICY "Users can delete their pokemons" ON public.trainer_pokemons FOR DELETE USING (true);

-- Insert initial pokemons (20-30 popular ones)
INSERT INTO public.pokemons (name, pokedex_number, type1, type2, image_url, height, weight, abilities) VALUES
('Bulbasaur', 1, 'Grass', 'Poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', 0.7, 6.9, ARRAY['Overgrow', 'Chlorophyll']),
('Ivysaur', 2, 'Grass', 'Poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png', 1.0, 13.0, ARRAY['Overgrow', 'Chlorophyll']),
('Venusaur', 3, 'Grass', 'Poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', 2.0, 100.0, ARRAY['Overgrow', 'Chlorophyll']),
('Charmander', 4, 'Fire', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', 0.6, 8.5, ARRAY['Blaze', 'Solar Power']),
('Charmeleon', 5, 'Fire', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png', 1.1, 19.0, ARRAY['Blaze', 'Solar Power']),
('Charizard', 6, 'Fire', 'Flying', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', 1.7, 90.5, ARRAY['Blaze', 'Solar Power']),
('Squirtle', 7, 'Water', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', 0.5, 9.0, ARRAY['Torrent', 'Rain Dish']),
('Wartortle', 8, 'Water', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png', 1.0, 22.5, ARRAY['Torrent', 'Rain Dish']),
('Blastoise', 9, 'Water', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', 1.6, 85.5, ARRAY['Torrent', 'Rain Dish']),
('Pikachu', 25, 'Electric', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 0.4, 6.0, ARRAY['Static', 'Lightning Rod']),
('Raichu', 26, 'Electric', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png', 0.8, 30.0, ARRAY['Static', 'Lightning Rod']),
('Jigglypuff', 39, 'Normal', 'Fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png', 0.5, 5.5, ARRAY['Cute Charm', 'Competitive']),
('Meowth', 52, 'Normal', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png', 0.4, 4.2, ARRAY['Pickup', 'Technician']),
('Psyduck', 54, 'Water', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png', 0.8, 19.6, ARRAY['Damp', 'Cloud Nine']),
('Machop', 66, 'Fighting', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png', 0.8, 19.5, ARRAY['Guts', 'No Guard']),
('Geodude', 74, 'Rock', 'Ground', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png', 0.4, 20.0, ARRAY['Rock Head', 'Sturdy']),
('Gastly', 92, 'Ghost', 'Poison', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png', 1.3, 0.1, ARRAY['Levitate']),
('Eevee', 133, 'Normal', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', 0.3, 6.5, ARRAY['Run Away', 'Adaptability']),
('Snorlax', 143, 'Normal', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', 2.1, 460.0, ARRAY['Immunity', 'Thick Fat']),
('Dragonite', 149, 'Dragon', 'Flying', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', 2.2, 210.0, ARRAY['Inner Focus', 'Multiscale']),
('Mewtwo', 150, 'Psychic', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', 2.0, 122.0, ARRAY['Pressure', 'Unnerve']),
('Mew', 151, 'Psychic', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png', 0.4, 4.0, ARRAY['Synchronize']),
('Togepi', 175, 'Fairy', NULL, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png', 0.3, 1.5, ARRAY['Hustle', 'Serene Grace']),
('Lugia', 249, 'Psychic', 'Flying', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png', 5.2, 216.0, ARRAY['Pressure', 'Multiscale']),
('Ho-Oh', 250, 'Fire', 'Flying', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png', 3.8, 199.0, ARRAY['Pressure', 'Regenerator']),
('Blaziken', 257, 'Fire', 'Fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png', 1.9, 52.0, ARRAY['Blaze', 'Speed Boost']),
('Gardevoir', 282, 'Psychic', 'Fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png', 1.6, 48.4, ARRAY['Synchronize', 'Trace']),
('Lucario', 448, 'Fighting', 'Steel', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png', 1.2, 54.0, ARRAY['Steadfast', 'Inner Focus']),
('Greninja', 658, 'Water', 'Dark', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png', 1.5, 40.0, ARRAY['Torrent', 'Protean']),
('Mimikyu', 778, 'Ghost', 'Fairy', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png', 0.2, 0.7, ARRAY['Disguise']);

-- Create index for faster queries
CREATE INDEX idx_trainer_pokemons_trainer ON public.trainer_pokemons(trainer_id);
CREATE INDEX idx_trainer_pokemons_location ON public.trainer_pokemons(location);
CREATE INDEX idx_pokemons_number ON public.pokemons(pokedex_number);