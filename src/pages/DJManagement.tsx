
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface DJ {
  id: string;
  name: string;
  username: string;
  phone_number: string;
}

const DJManagement = () => {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDJ, setNewDJ] = useState({ name: "", username: "", phone_number: "" });
  const [editingDJ, setEditingDJ] = useState<DJ | null>(null);
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

  const handleCreateDJ = async () => {
    try {
      // Generate a random password for the DJ (they can reset it later)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // First create an auth user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${newDJ.username}@yourdomain.com`, // Using username as email for now
        password: tempPassword,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      // Now create the profile with the auth user's id
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

      setDjs([...djs, data]);
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

  const handleUpdateDJ = async () => {
    if (!editingDJ) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingDJ.name,
          username: editingDJ.username,
          phone_number: editingDJ.phone_number
        })
        .eq('id', editingDJ.id);

      if (error) throw error;

      setDjs(djs.map(dj => dj.id === editingDJ.id ? editingDJ : dj));
      toast({
        title: "DJ actualizado",
        description: "Los datos del DJ han sido actualizados exitosamente.",
      });
      setEditingDJ(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
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
          </Dialog>
        </div>

        <div className="grid gap-4">
          {djs.map((dj) => (
            <div
              key={dj.id}
              className="bg-[#333333] p-4 rounded-lg flex justify-between items-center"
            >
              <div className="text-white">
                <p className="font-semibold">{dj.name}</p>
                <p className="text-sm text-gray-400">{dj.username}</p>
                <p className="text-sm text-gray-400">{dj.phone_number}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-[#444444] text-white hover:bg-[#555555] border-none"
                      onClick={() => setEditingDJ(dj)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#333333] text-white">
                    <DialogHeader>
                      <DialogTitle>Editar DJ</DialogTitle>
                    </DialogHeader>
                    {editingDJ && (
                      <div className="space-y-4">
                        <Input
                          placeholder="Nombre"
                          value={editingDJ.name}
                          onChange={(e) => setEditingDJ({ ...editingDJ, name: e.target.value })}
                          className="bg-[#444444] text-white border-[#555555]"
                        />
                        <Input
                          placeholder="Nombre de usuario"
                          value={editingDJ.username}
                          onChange={(e) => setEditingDJ({ ...editingDJ, username: e.target.value })}
                          className="bg-[#444444] text-white border-[#555555]"
                        />
                        <Input
                          placeholder="Teléfono"
                          value={editingDJ.phone_number}
                          onChange={(e) => setEditingDJ({ ...editingDJ, phone_number: e.target.value })}
                          className="bg-[#444444] text-white border-[#555555]"
                        />
                        <Button 
                          onClick={handleUpdateDJ}
                          className="w-full bg-[#444444] text-white hover:bg-[#555555]"
                        >
                          Actualizar DJ
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none"
                  onClick={() => handleDeleteDJ(dj.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DJManagement;
