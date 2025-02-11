import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SuggestionForm from "@/components/SuggestionForm";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get("venue");

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      {venueId ? <SuggestionForm /> : <Hero />}
    </div>
  );
};

export default Index;