
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { DJ } from "@/types/dj";
import { CreateDJForm } from "@/components/dj/CreateDJForm";
import { DJListItem } from "@/components/dj/DJListItem";

const DJManagement = () => {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
        return;
      }
      
      fetchDJs();
    };

    init();
  }, [navigate]);

  const fetchDJs = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'dj');

      if (error) throw error;
      setDjs(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDJ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDjs(djs.filter(dj => dj.id !== id));
      toast({
        title: "DJ eliminado",
        description: "El DJ ha sido eliminado exitosamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-white text-xl">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Gestión de DJs</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#333333] text-white hover:bg-[#444444]">
                <Plus className="h-4 w-4 mr-2" />
                Agregar DJ
              </Button>
            </DialogTrigger>
            <CreateDJForm onSuccess={(newDJ) => setDjs([...djs, newDJ])} />
          </Dialog>
        </div>

        <div className="grid gap-4">
          {djs.map((dj) => (
            <DJListItem
              key={dj.id}
              dj={dj}
              onUpdate={(updatedDJ) => 
                setDjs(djs.map(d => d.id === updatedDJ.id ? updatedDJ : d))
              }
              onDelete={handleDeleteDJ}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DJManagement;
