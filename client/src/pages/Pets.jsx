import PetSearch from "../components/PetSearch";

export default function Pets() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Pet</h1>
      <PetSearch />
    </div>
  );
}