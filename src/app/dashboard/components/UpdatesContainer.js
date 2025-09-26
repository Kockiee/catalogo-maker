// Importações necessárias (componente server-side)
import { FaGithub } from "react-icons/fa";
import moment from "moment";

/**
 * Componente para exibir as últimas atualizações do projeto no GitHub
 * Busca os pull requests mais recentes e exibe informações sobre eles
 * @returns {Promise<JSX.Element>} Container com informações de atualizações
 */
export default async function UpdatesContainer() {
    // Faz requisição para a API do GitHub para obter os pull requests mais recentes
    const response = await fetch("https://api.github.com/repos/Kockiee/catalogo-maker/pulls", {
        headers: {
            "Accept": "application/vnd.github+json",                    // Tipo de resposta da API
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`, // Token de autenticação
            "X-GitHub-Api-Version": "2022-11-28"                         // Versão da API do GitHub
        },
        next: {
            revalidate: 600  // Revalida os dados a cada 10 minutos (600 segundos)
        }
    });
    // Converte a resposta para JSON
    const data = await response.json();

    // Logs de debug (remover em produção)
    console.log(process.env.NEXT_PUBLIC_GITHUB_TOKEN)
    console.log(response);
    console.log(data);

    // Renderiza o container de atualizações
    return (
        <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md">
            {/* Título da seção */}
            <h1 className="text-xl font-bold mb-2">Atualizações da Catálogo Maker</h1>
            {/* Título do pull request mais recente */}
            <h2 className="textlg font-bold mb-2">{data[0].title}</h2>
            {/* Descrição do pull request */}
            <p>{data[0].body}</p>
            {/* Rodapé com informações adicionais */}
            <div className='w-full grid grid-cols-2'>
                {/* Crédito do GitHub */}
                <p className="w-full text-start text-gray-600 dark:text-gray-400 inline-flex">
                    Powered by GitHub <FaGithub className="ml-1 w-6 h-6"/>
                </p>
                {/* Data da última atualização */}
                <p className="w-full text-end text-gray-600 dark:text-gray-400">
                    Data da atualização: {moment(data[0].updated_at).format('MM/DD/YYYY')}
                </p>
            </div>
        </div>
    );
}