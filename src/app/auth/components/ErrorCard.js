export default function ErrorCard({error}) {
    return error !== "" && (
        <p
        className='text-red-600 border border-red-600 p-2 bg-red-200 rounded mb-2'
        >
            {error}
        </p>
    )
}