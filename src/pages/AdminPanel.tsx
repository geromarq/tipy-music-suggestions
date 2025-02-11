
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
      } else {
        setUserName(profile.email || user.email || "");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "¡Hasta pronto!",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
