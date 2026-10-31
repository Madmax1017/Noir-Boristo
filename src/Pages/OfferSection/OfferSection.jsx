import "./offers.css";

export default function OfferSection() {
    return (
        <section className="offer-section">
            {/* Background image */}
            <img
                src="/images/ambience/_DSC9886.jpg"
                alt="Noir Bistro dining experience"
                className="offer-background"
            />

            {/* Red overlay */}
            <div className="offer-overlay" />

            {/* Offer content */}
            <div className="offer-content">
                <p className="offer-eyebrow">
                    A LITTLE SOMETHING FROM NOIR
                </p>

                <h2 className="offer-title">
                    WEEKLY SPECIAL OFFER
                </h2>

                <p className="offer-description">
                    Every week brings something worth looking forward to.
                    Discover our exclusive weekly offer and make your next
                    Noir experience even more special.
                </p>

                <a href="#signature-dishes" className="offer-button">
                    EXPLORE THIS WEEK'S OFFER
                </a>
            </div>
        </section>
    );
}