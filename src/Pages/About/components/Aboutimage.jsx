// src/pages/About/components/AboutImage.jsx

export default function AboutImage() {
    return (
      <div className="about-image group relative">
        <div className="aspect-[5/4] overflow-hidden bg-noir-black">
          <img
            src="/images/ambience/_DSC9886.jpg"
            alt="The atmosphere inside Noir Bistro"
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        </div>
  
        <div className="absolute -bottom-5 right-0 bg-noir-black px-6 py-5 text-noir-red md:-right-5 md:px-10 md:py-7">
          <p className="font-anton text-3xl uppercase leading-none md:text-5xl">
            THE NOIR
            <br />
            EXPERIENCE.
          </p>
        </div>
  
        <span className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-noir-black md:-left-5 md:-top-5 md:h-24 md:w-24" />
      </div>
    );
  }