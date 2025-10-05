/**
 * Componente de container de atualizações
 * 
 * Este arquivo contém um componente que busca e exibe as últimas
 * atualizações do projeto através da API do GitHub. Mostra informações
 * sobre pull requests e atualizações recentes do repositório.
 * 
 * Funcionalidades principais:
 * - Busca dados da API do GitHub
 * - Exibe informações de pull requests
 * - Cache com revalidação automática
 * - Interface responsiva
 * - Integração com GitHub
 */

// Componente assíncrono que busca atualizações do GitHub
export default async function UpdatesContainer() {
    // Faz requisição para a API do GitHub para buscar pull requests
    const response = await fetch("https://api.github.com/repos/Kockiee/catalogo-maker/pulls", {
        headers: {
            "Accept": "application/vnd.github+json", // Tipo de conteúdo aceito
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`, // Token de autenticação
            "X-GitHub-Api-Version": "2022-11-28" // Versão da API do GitHub
        },
        next: {
            revalidate: 600 // Revalida os dados a cada 10 minutos
        }
    });
    // Converte a resposta para JSON
    const data = await response.json();

    // Logs para debug (remover em produção)
    console.log(process.env.NEXT_PUBLIC_GITHUB_TOKEN)
    console.log(response);
    console.log(data);

    return (
        {/* Container principal das atualizações */}
        <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md">
            {/* Título da seção */}
            <h1 className="text-xl font-bold mb-2">Atualizações da Catálogo Maker</h1>
            {/* Título da última atualização */}
            <h2 className="textlg font-bold mb-2">{data[0].title}</h2>
            {/* Descrição da atualização */}
            <p>{data[0].body}</p>
            {/* Footer com informações adicionais */}
            <div className='w-full grid grid-cols-2'>
                {/* Crédito ao GitHub */}
                <p className="w-full text-start text-gray-600 dark:text-gray-400 inline-flex">Powered by GitHub <FaGithub className="ml-1 w-6 h-6"/></p>
                {/* Data da última atualização */}
                <p className="w-full text-end text-gray-600 dark:text-gray-400">Data da atualização: {moment(data[0].updated_at).format('MM/DD/YYYY')}</p>
            </div>
        </div>
    );
}