
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "¡Hasta pronto!",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/');
    }
  };

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
