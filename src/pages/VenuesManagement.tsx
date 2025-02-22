import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Home, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Venue {
  id: string;
  name: string;
  address: string;
  created_at: string;
}

const VenuesManagement = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [newVenue, setNewVenue] = useState({ name: '', address: '' });
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const venuesPerPage = 8;

  const fetchVenues = async () => {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching venues:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los locales.",
      });
      return;
    }

    setVenues(data || []);
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          navigate('/login');
          return;
        }

        if (!user) {
          console.log("No user found, redirecting to login");
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error al verificar permisos de usuario.",
          });
          navigate('/login');
          return;
        }

        if (!profile || profile.role !== 'admin') {
          console.log("User is not admin:", profile);
          toast({
            variant: "destructive",
            title: "Acceso denegado",
            description: "No tienes permisos de administrador.",
          });
          navigate('/');
          return;
        }

        fetchVenues();
      } catch (error) {
        console.error('Error in checkAdminAccess:', error);
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const handleCreate = async () => {
    if (!newVenue.name || !newVenue.address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor complete todos los campos.",
      });
      return;
    }

    const { error } = await supabase
      .from('venues')
      .insert([newVenue]);

    if (error) {
      console.error('Error creating venue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el local.",
      });
      return;
    }

    setOpen(false);
    setNewVenue({ name: '', address: '' });
    toast({
      title: "Local creado",
      description: "El local ha sido creado exitosamente.",
    });
    fetchVenues();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting venue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el local.",
      });
      return;
    }

    toast({
      title: "Local eliminado",
      description: "El local ha sido eliminado exitosamente.",
    });
    fetchVenues();
  };

  const totalPages = Math.ceil(venues.length / venuesPerPage);
  const paginatedVenues = venues.slice(
    currentPage * venuesPerPage,
    (currentPage + 1) * venuesPerPage
  );

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-white">Gestión de Locales</h1>
          <Button
            onClick={() => navigate('/admin')}
            className="w-fit bg-[#333333] text-white hover:bg-[#444444]"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="flex justify-end mb-8 mt-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#333333] text-white hover:bg-[#444444]">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Local
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#333333] text-white border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-white">Crear Nuevo Local</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nombre</Label>
                  <Input
                    id="name"
                    value={newVenue.name}
                    onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                    className="bg-[#444444] border-[#555555] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">Dirección</Label>
                  <Input
                    id="address"
                    value={newVenue.address}
                    onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
                    className="bg-[#444444] border-[#555555] text-white"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Crear Local
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {paginatedVenues.map((venue) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="bg-[#333333] text-white hover:bg-[#444444]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-medium">
              {currentPage + 1} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="bg-[#333333] text-white hover:bg-[#444444]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesManagement;
