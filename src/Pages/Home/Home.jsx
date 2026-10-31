
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SignatureDishes from "../SignatureDishes/SignatureDishes";
import MessageSection from "../Message/MessageSection";
import AmbienceSection from "../Ambience/AmbienceSection";
import AboutSection from "../About/AboutSection";
import ContactSection from "../Contact/ContactSection";
import OfferSection from "../OfferSection/OfferSection";

export default function Home() {
    return (
        <main
            id="home"
            className="min-h-screen bg-noir-red"
        >
            <Navbar />
            <HeroSection />
            <SignatureDishes />
            <OfferSection />
            <MessageSection />
            <AboutSection />
            <AmbienceSection />
            <ContactSection />
        </main>
    );
}
