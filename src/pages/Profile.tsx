import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Save, Edit } from "lucide-react";

export default function Profile() {
  const [trainer, setTrainer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    photo_url: "",
    city: "",
  });

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    const { data } = await supabase.from("trainers").select("*").limit(1).single();
    
    if (data) {
      setTrainer(data);
      setFormData({
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        photo_url: data.photo_url || "",
        city: data.city,
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.cpf || !formData.city) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (trainer) {
      const { error } = await supabase
        .from("trainers")
        .update(formData)
        .eq("id", trainer.id);

      if (error) {
        toast.error("Erro ao atualizar perfil");
        return;
      }
    } else {
      const { error } = await supabase.from("trainers").insert([formData]);

      if (error) {
        toast.error("Erro ao criar perfil");
        return;
      }
    }

    toast.success("Perfil salvo com sucesso!");
    setIsEditing(false);
    loadTrainer();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Perfil do Treinador</h1>
            {trainer && !isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                {formData.photo_url ? (
                  <img
                    src={formData.photo_url}
                    alt="Foto do treinador"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  disabled={!isEditing}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Sua cidade"
                />
              </div>

              <div>
                <Label htmlFor="photo">URL da Foto</Label>
                <Input
                  id="photo"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://..."
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  {trainer && (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: trainer.name,
                          email: trainer.email,
                          cpf: trainer.cpf,
                          photo_url: trainer.photo_url || "",
                          city: trainer.city,
                        });
                      }}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
