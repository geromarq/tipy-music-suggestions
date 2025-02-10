
import { DJ } from "@/types/dj";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { EditDJForm } from "./EditDJForm";

interface DJListItemProps {
  dj: DJ;
  onUpdate: (updatedDJ: DJ) => void;
  onDelete: (id: string) => void;
}

export const DJListItem = ({ dj, onUpdate, onDelete }: DJListItemProps) => {
  return (
    <div className="bg-[#333333] p-4 rounded-lg flex justify-between items-center">
      <div className="text-white">
        <p className="font-semibold">{dj.name}</p>
        <p className="text-sm text-gray-400">{dj.username}</p>
        <p className="text-sm text-gray-400">{dj.phone_number}</p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-[#444444] text-white hover:bg-[#555555] border-none"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <EditDJForm dj={dj} onSuccess={onUpdate} />
        </Dialog>
        <Button
          variant="outline"
          size="icon"
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none"
          onClick={() => onDelete(dj.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
