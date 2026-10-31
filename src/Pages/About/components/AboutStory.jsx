// src/pages/About/components/AboutStory.jsx

export default function AboutStory() {
    return (
      <div className="about-story">
        <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-noir-black/60">
          NOT JUST ABOUT FOOD
        </p>
  
        <h3 className="max-w-lg font-anton text-4xl uppercase leading-[1.05] text-noir-black md:text-5xl">
          A LITTLE DRAMA.
          <br />
          A LOT OF FLAVOUR.
        </h3>
  
        <div className="mt-8 max-w-md space-y-5 text-sm leading-7 text-noir-black/75 md:text-base">
          <p>
            At Noir, every visit is an invitation to slow down, explore bold
            flavours and enjoy the moment.
          </p>
  
          <p>
            From the first bite to the last conversation, we believe great food
            deserves an atmosphere just as unforgettable.
          </p>
  
          <p>
            Come as you are. Stay a little longer. Make it a Noir moment.
          </p>
        </div>
  
        <div className="mt-10">
          <span className="border-b border-noir-black pb-2 text-xs font-bold tracking-[0.2em] text-noir-black">
            THIS IS THE NOIR WAY
          </span>
        </div>
      </div>
    );
  }