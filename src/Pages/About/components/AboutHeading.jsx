// src/pages/About/components/AboutHeading.jsx

export default function AboutHeading() {
    return (
      <div className="about-heading">
        <p className="mb-5 text-xs font-semibold tracking-[0.35em] text-noir-black/70">
          01 — THE STORY OF NOIR
        </p>
  
        <h2 className="font-anton text-[clamp(4rem,11vw,10rem)] uppercase leading-[0.85] tracking-tight text-noir-black">
          MORE THAN
          <br />
          JUST A <span className="text-[#F5E9D7]">MEAL.</span>
        </h2>
  
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-12 bg-noir-black" />
          <p className="text-xs tracking-[0.25em] text-noir-black/70">
            AN EXPERIENCE CALLED NOIR
          </p>
        </div>
      </div>
    );
  }