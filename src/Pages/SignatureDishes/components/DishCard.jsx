
export default function DishCard({ dish, isActive }) {
    return (
        <article
            className={`dish-card relative h-full w-full overflow-hidden bg-noir-red ${
                isActive ? "opacity-100" : "opacity-75"
            }`}
            aria-label={`${dish.name} — ${dish.category}`}
        >
            <img
                src={dish.image}
                alt={`${dish.name} (${dish.category})`}
                draggable="false"
                loading={dish.id === 1 ? "eager" : "lazy"}
                className="dish-image h-full w-full select-none object-contain"
            />
        </article>
    );
}
