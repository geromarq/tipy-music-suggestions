import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-primary to-primary-light overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/0cf49880-2e37-412b-a04d-b333d446c7bd.png')] bg-cover bg-center opacity-20" />
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Bienvenido a Tipy
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Transforma la experiencia de tus eventos con nuestra plataforma de gestión de sugerencias musicales para DJs
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-primary-light hover:text-white">
              Por más información
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              Contáctenos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;