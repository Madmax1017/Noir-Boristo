
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SignatureDishes from "../SignatureDishes/SignatureDishes";
import MessageSection from "../Message/MessageSection";
import AmbienceSection from "../Ambience/AmbienceSection";

export default function Home() {
    return (
        <main
            id="home"
            className="min-h-screen bg-noir-red"
        >
            <Navbar />
            <HeroSection />
            <SignatureDishes />
            <MessageSection />
           
            <AmbienceSection />
        </main>
    );
}
