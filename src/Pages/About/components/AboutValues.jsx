// src/pages/About/components/AboutValues.jsx

const values = [
  {
    number: "01",
    title: "BOLD FLAVOURS",
    description: "Made to excite your senses.",
  },
  {
    number: "02",
    title: "GOOD ENERGY",
    description: "Where every moment feels right.",
  },
  {
    number: "03",
    title: "LASTING MOMENTS",
    description: "Experiences worth coming back for.",
  },
];

export default function AboutValues() {
  return (
    <div className="about-values mt-32 border-t border-noir-black/30 pt-8 md:mt-44">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h3 className="font-anton text-4xl uppercase text-noir-black md:text-6xl">
          WHAT MAKES US NOIR?
        </h3>

        <p className="text-xs tracking-[0.2em] text-noir-black/60">
          THE THINGS WE BELIEVE IN
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        {values.map((value) => (
          <div
            key={value.number}
            className="border-t border-noir-black/40 pt-5"
          >
            <span className="text-xs tracking-widest text-noir-black/60">
              {value.number}
            </span>

            <h4 className="mt-8 font-anton text-3xl uppercase text-noir-black md:text-4xl">
              {value.title}
            </h4>

            <p className="mt-3 text-sm text-noir-black/70">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}