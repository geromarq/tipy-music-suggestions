
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DJ } from "@/types/dj";

interface CreateDJFormProps {
  onSuccess: (newDJ: DJ) => void;
}

export const CreateDJForm = ({ onSuccess }: CreateDJFormProps) => {
  const [newDJ, setNewDJ] = useState({ name: "", username: "", phone_number: "" });
  const { toast } = useToast();

  const handleCreateDJ = async () => {
    try {
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${newDJ.username}@yourdomain.com`,
        password: tempPassword,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: newDJ.name,
          username: newDJ.username,
          phone_number: newDJ.phone_number,
          role: 'dj' as const
        })
        .select()
        .single();

      if (error) throw error;

      onSuccess(data);
      toast({
        title: "DJ creado",
        description: "El DJ ha sido creado exitosamente. Contraseña temporal: " + tempPassword,
      });
      setNewDJ({ name: "", username: "", phone_number: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <DialogContent className="bg-[#333333] text-white">
      <DialogHeader>
        <DialogTitle>Agregar Nuevo DJ</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="Nombre"
          value={newDJ.name}
          onChange={(e) => setNewDJ({ ...newDJ, name: e.target.value })}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Input
          placeholder="Nombre de usuario"
          value={newDJ.username}
          onChange={(e) => setNewDJ({ ...newDJ, username: e.target.value })}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Input
          placeholder="Teléfono"
          value={newDJ.phone_number}
          onChange={(e) => setNewDJ({ ...newDJ, phone_number: e.target.value })}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Button 
          onClick={handleCreateDJ}
          className="w-full bg-[#444444] text-white hover:bg-[#555555]"
        >
          Crear DJ
        </Button>
      </div>
    </DialogContent>
  );
};
