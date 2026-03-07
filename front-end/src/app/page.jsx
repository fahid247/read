import Banner from "@/components/Banner/Banner";
import Coverage from "@/components/Coverage/Coverage";
import LatestBooks from "@/components/LatestBook/LatestBook";
import Newsletter from "../components/NewsLetter/NewsLetter";
import QualityTrust from "@/components/QualityTrust/QualityTrust"
import Services from "@/components/Services/Services";
import TrustedBy from "@/components/TrustedBy/TrustedBy";
import WhyChoose from "@/components/WhyChoose/WhyChoose";

export default function Home() {
  return (
    <div className="">
        <Banner></Banner>
        <section>
            <LatestBooks></LatestBooks>
        </section>
        <section>
            <Services></Services>
        </section>
        <section>
            <Coverage></Coverage>
        </section>
        <section>
            <QualityTrust></QualityTrust>
        </section>
        <section>
            <TrustedBy></TrustedBy>
        </section>
        <section>
            <WhyChoose></WhyChoose>
        </section>
        <section>
            <Newsletter></Newsletter>
        </section>

    </div>
  );
}
