interface GameCounterProps {
    filteredCount: number;
    totalCount: number;
}

const GameCounter = ({ filteredCount, totalCount }: GameCounterProps) => {
    // Mensaje dinámico dependiendo de si se están aplicando filtros o no.
    const message = filteredCount === totalCount
        ? `¡Mostrando los ${totalCount} juegos encontrados!`
        : `Mostrando ${filteredCount} de ${totalCount} juegos`;

    // No renderizar nada si no hay juegos en total.
    if (totalCount === 0) {
        return null;
    }

    return (
        <div className="text-center my-8">
        <p className="text-lg text-cyan-400 bg-slate-800/50 inline-block px-4 py-2 rounded-full">
            {message}
            </p>
            </div>
    );
};

export default GameCounter;