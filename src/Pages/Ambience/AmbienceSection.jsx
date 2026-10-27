
import Gallery from "./components/Gallery";

export default function AmbienceSection() {
  return (
    <section
      id="ambience"
      aria-label="Explore the ambience of Noir Bistro"
      className="relative overflow-hidden bg-noir-red text-noir-black"
    >
      <Gallery />
    </section>
  );
}
