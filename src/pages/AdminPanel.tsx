
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChartBar, Building2, CalendarDays, ListTodo, Settings, Music, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate('/login');
          return;
        }

        // Fetch user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        console.log("Profile data:", profile);

        if (!profile || profile.role !== 'admin') {
          toast({
            variant: "destructive",
            title: "Acceso denegado",
            description: "No tienes permisos de administrador.",
          });
          navigate('/');
          return;
        }

        setUserName(profile.name || user.email || "Admin");
      } catch (error: any) {
        console.error('Error in checkAdminAccess:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al verificar tus permisos. Por favor intenta de nuevo.",
        });
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "¡Hasta pronto!",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al cerrar sesión. Por favor intenta de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">{userName}</span>
            <Button
              variant="outline"
              className="bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profits Card */}
          <div className="col-span-full bg-[#333333] rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
              <ChartBar className="h-6 w-6" />
              Ganancias y Estadísticas
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-[#444444] rounded-md p-4">
                <p className="text-sm text-gray-300">Ganancias Totales</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
              <div className="bg-[#444444] rounded-md p-4">
                <p className="text-sm text-gray-300">Pagos a DJs</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
              <div className="bg-[#444444] rounded-md p-4">
                <p className="text-sm text-gray-300">Ganancias Admin</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={() => navigate('/admin/venues')}
          >
            <Building2 className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Locales</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={() => navigate('/admin/events')}
          >
            <CalendarDays className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Eventos</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={() => navigate('/admin/suggestions')}
          >
            <ListTodo className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Sugerencias</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="h-8 w-8" />
            <span className="text-lg font-semibold">Configuración de Pagos</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 bg-[#333333] text-white border-[#444444] hover:bg-[#444444] hover:text-white"
            onClick={() => navigate('/admin/djs')}
          >
            <Music className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar DJs</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
