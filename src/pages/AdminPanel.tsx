
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChartBar, Building2, CalendarDays, ListTodo, Settings } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();

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

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>
        
        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profits Card */}
          <div className="col-span-full bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ChartBar className="h-6 w-6" />
              Ganancias y Estadísticas
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-background rounded-md p-4">
                <p className="text-sm text-muted-foreground">Ganancias Totales</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="bg-background rounded-md p-4">
                <p className="text-sm text-muted-foreground">Pagos a DJs</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="bg-background rounded-md p-4">
                <p className="text-sm text-muted-foreground">Ganancias Admin</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate('/admin/venues')}
          >
            <Building2 className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Locales</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate('/admin/events')}
          >
            <CalendarDays className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Eventos</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate('/admin/suggestions')}
          >
            <ListTodo className="h-8 w-8" />
            <span className="text-lg font-semibold">Gestionar Sugerencias</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 flex flex-col items-center justify-center gap-4 hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="h-8 w-8" />
            <span className="text-lg font-semibold">Configuración de Pagos</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
