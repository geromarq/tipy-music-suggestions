
import { DJ } from "@/types/dj";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditDJFormProps {
  dj: DJ;
  onSuccess: (updatedDJ: DJ) => void;
}

export const EditDJForm = ({ dj, onSuccess }: EditDJFormProps) => {
  const { toast } = useToast();

  const handleUpdateDJ = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: dj.name,
          username: dj.username,
          phone_number: dj.phone_number
        })
        .eq('id', dj.id);

      if (error) throw error;

      onSuccess(dj);
      toast({
        title: "DJ actualizado",
        description: "Los datos del DJ han sido actualizados exitosamente.",
      });
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
        <DialogTitle>Editar DJ</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="Nombre"
          value={dj.name}
          onChange={(e) => dj.name = e.target.value}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Input
          placeholder="Nombre de usuario"
          value={dj.username}
          onChange={(e) => dj.username = e.target.value}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Input
          placeholder="Teléfono"
          value={dj.phone_number}
          onChange={(e) => dj.phone_number = e.target.value}
          className="bg-[#444444] text-white border-[#555555]"
        />
        <Button 
          onClick={handleUpdateDJ}
          className="w-full bg-[#444444] text-white hover:bg-[#555555]"
        >
          Actualizar DJ
        </Button>
      </div>
    </DialogContent>
  );
};
