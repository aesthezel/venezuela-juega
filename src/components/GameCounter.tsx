interface GameCounterProps {
    filteredCount: number;
    totalCount: number;
}

const GameCounter = ({ filteredCount, totalCount }: GameCounterProps) => {
    const message = filteredCount === totalCount
        ? `¡Mostrando los ${totalCount} juegos encontrados!`
        : `Mostrando ${filteredCount} de ${totalCount} juegos`;

    if (totalCount === 0) {
        return null;
    }

    return (
        <div className="text-center my-8">
        <p className="text-lg text-accent-teal bg-surface-800/50 inline-block px-4 py-2 rounded-full">
            {message}
            </p>
            </div>
    );
};

export default GameCounter;