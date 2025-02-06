import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventInfoProps {
  date: string;
  djName: string;
  venueName: string;
}

const EventInfo = ({ date, djName, venueName }: EventInfoProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Información del Evento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-white/80">
          <span>Fecha:</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between text-white/80">
          <span>DJ:</span>
          <span>{djName}</span>
        </div>
        <div className="flex justify-between text-white/80">
          <span>Lugar:</span>
          <span>{venueName}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInfo;