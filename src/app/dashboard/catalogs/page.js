import CatalogsTable from "@/app/components/CatalogsTable";

export default function PAGE() {
  return (
    <div className="flex-col space-y-2">
      <h1 className="text-3xl font-bold">Seus catálogos</h1>
      <CatalogsTable/>
    </div>
  );
};