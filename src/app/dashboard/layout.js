import DashboardLayout from "../components/DashboardLayout";


export const metadata = {
  title: 'Dashboard',
  description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

export default function PAGE({children}) {
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
}