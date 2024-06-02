export default async function UpdatesContainer() {
    const response = await fetch("https://api.github.com/repos/Kockiee/catalogo-maker/pulls", {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        next: {
            revalidate: 600
        }
    });
    const data = await response.json();

    console.log(process.env.NEXT_PUBLIC_GITHUB_TOKEN)
    console.log(response);
    console.log(data);

    return (
        <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md">
            <h1 className="text-xl font-bold mb-2">Atualizações da Catálogo Maker</h1>
            <h2 className="textlg font-bold mb-2">{data[0].title}</h2>
            <p>{data[0].body}</p>
            <div className='w-full grid grid-cols-2'>
                <p className="w-full text-start text-gray-600 dark:text-gray-400 inline-flex">Powered by GitHub <FaGithub className="ml-1 w-6 h-6"/></p>
                <p className="w-full text-end text-gray-600 dark:text-gray-400">Data da atualização: {moment(data[0].updated_at).format('MM/DD/YYYY')}</p>
            </div>
        </div>
    );
}