
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      setIsLoading(false);
    });

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        await checkUserRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "¡Hasta pronto!",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return null; // Or return a loading spinner if you prefer
  }

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Tipy
          </Link>
          <div className="flex gap-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" className="text-white hover:text-primary-light">
                  Panel Admin
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button variant="ghost" className="text-white hover:text-primary-light">
                Contáctenos
              </Button>
            </Link>
            {isAuthenticated ? (
              <Button 
                variant="secondary"
                className="bg-secondary hover:bg-primary-light text-white"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Link to="/login">
                <Button className="bg-secondary hover:bg-primary-light text-white">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
