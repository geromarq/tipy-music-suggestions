
import { useSearchParams } from "react-router-dom";
import SuggestionForm from "@/components/SuggestionForm";

const Index = () => {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get("venue");

  return (
    <div className="min-h-screen bg-primary">
      {venueId ? (
        <SuggestionForm />
      ) : (
        <div className="relative min-h-screen">
          {/* Hero Section */}
          <div className="relative h-screen">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/99d2ad72-3e05-4438-804b-4d289d3776e6.png')] bg-cover bg-center">
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                Bienvenido a Tipy
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
                La plataforma que conecta a los DJs con su público, permitiendo una experiencia musical más interactiva y personalizada
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-[#121212] py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                ¿Cómo funciona?
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/7bc7e2c6-e543-4eac-af58-aab609ab9a24.png"
                    alt="DJ Setup"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6 flex flex-col justify-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Para el Público</h3>
                    <p className="text-gray-300">
                      1. Escanea el código QR en el local
                    </p>
                    <p className="text-gray-300">
                      2. Sugiere tus canciones favoritas
                    </p>
                    <p className="text-gray-300">
                      3. ¡Disfruta de la música!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Para DJs</h3>
                    <p className="text-gray-300">
                      1. Recibe sugerencias en tiempo real
                    </p>
                    <p className="text-gray-300">
                      2. Gestiona las peticiones fácilmente
                    </p>
                    <p className="text-gray-300">
                      3. Conecta mejor con tu audiencia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
