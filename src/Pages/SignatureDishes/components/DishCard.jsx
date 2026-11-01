/**
 * The centred dish: framed photo + faded watermark of the dish type.
 * SignatureDishes animates these through the data-wm / data-frame hooks.
 */
export default function DishCard({ dish }) {
    return (
        <>
            {/* Watermark: the dish type */}
            <span
                data-wm
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-anton text-[clamp(8rem,30vw,26rem)] uppercase leading-none text-noir-black/10"
            >
                {dish.type}
            </span>

            <div
                data-frame
                className="relative aspect-[4/5] w-[min(78vw,calc(54svh*0.8),24rem)] overflow-hidden border-4 border-noir-black bg-noir-black md:aspect-square md:w-[min(54svh,34rem)]"
            >
                <img
                    src={dish.image}
                    alt={dish.name}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                    className="h-full w-full object-cover"
                />
            </div>
        </>
    );
}