import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import EventInfo from "./EventInfo";

const SuggestionForm = () => {
  const [suggestionType, setSuggestionType] = useState("cancion");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-light py-20">
      <div className="container max-w-lg mx-auto px-4">
        <EventInfo 
          date="26 de Marzo, 2024"
          djName="DJ Example"
          venueName="Club Example"
        />
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <Label className="text-white">Información Personal</Label>
            <Input 
              placeholder="Nombre (opcional)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input 
              placeholder="Número de teléfono"
              type="tel"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white">Tipo de Sugerencia</Label>
            <RadioGroup
              defaultValue="cancion"
              onValueChange={setSuggestionType}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancion" id="cancion" />
                <Label htmlFor="cancion" className="text-white">Canción</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="genero" id="genero" />
                <Label htmlFor="genero" className="text-white">Género</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="otro" id="otro" />
                <Label htmlFor="otro" className="text-white">Otro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-white">Tu Sugerencia</Label>
            <Textarea 
              placeholder="Escribe tu sugerencia aquí..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Button 
            type="submit"
            size="lg"
            className="w-full bg-secondary hover:bg-primary-light text-white"
          >
            Continuar al Pago
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SuggestionForm;