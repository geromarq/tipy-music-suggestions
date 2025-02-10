
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Venue {
  id: string;
  name: string;
  address: string;
  created_at: string;
}

const VenuesManagement = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
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
      }
    };

    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los locales.",
        });
        return;
      }

      setVenues(data);
    };

    checkAdminAccess();
    fetchVenues();
  }, [navigate, toast]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el local.",
      });
      return;
    }

    setVenues(venues.filter(venue => venue.id !== id));
    toast({
      title: "Local eliminado",
      description: "El local ha sido eliminado exitosamente.",
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Gestión de Locales</h1>
          <Button
            onClick={() => navigate('/admin/venues/new')}
            className="bg-[#333333] text-white hover:bg-[#444444]"
          >
            Nuevo Local
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-[#333333] rounded-lg p-6 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{venue.name}</h3>
              <p className="text-gray-300 mb-2">{venue.address}</p>
              <p className="text-sm text-gray-400 mb-4">
                Creado el {format(new Date(venue.created_at), 'dd/MM/yyyy')}
              </p>
              <div className="flex gap-4 mt-auto">
                <Button
                  variant="destructive"
                  className="flex-1 bg-[#ea384c] hover:bg-[#ea384c]/90"
                  onClick={() => handleDelete(venue.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/admin/venues/edit/${venue.id}`)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modificar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenuesManagement;
