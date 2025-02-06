import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Tipy
          </Link>
          <div className="flex gap-4">
            <Link to="/contact">
              <Button variant="ghost" className="text-white hover:text-primary-light">
                Contáctenos
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-secondary hover:bg-primary-light text-white">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;