import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NewDocumentButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/novo-documento")}
      size="lg"
      className="shadow-md hover:shadow-lg transition-shadow"
    >
      <Plus className="w-5 h-5 mr-2" />
      Novo Documento
    </Button>
  );
};
