import Head from 'next/head';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Breadcrumb from '../components/molecules/Breadcrumb';
//import Image from 'next/image';
// Page-level styles are imported globally from _app.tsx

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — Shamanicca</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          

          <section className="main-condensed  content">
            
            <div className="page mt-md-responsive mb-lg-responsive">
              
              <Breadcrumb
                ariaLabel="Breadcrumb"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'About' },
                ]}
              />
                              
                              <h1 className='type-5xl type-extrabold type-center'>About Shamanicca</h1>
              <div className="page-image-wrapper">
                <img
                  src="https://placehold.co/914x548.png"
                  alt="About Shamanicca hero"
                  className="rounded-30"
                />
              </div>
              <div className="page-content-wrapper">
                <div className="page-section">
                  <p className="type-paragraph type-medium type-gray-90">
                    At Shamanicca, we wholeheartedly embrace the mystical energies that shape our lives and experiences. Our signature hoodie transcends mere apparel; it symbolizes a transformative journey filled with positivity and spiritual protection. Each piece is lovingly crafted in the vibrant and artistic city of Montreal, where creativity flows like the St. Lawrence River. This classic black hoodie, made from a luxurious blend of 50% Cotton and 50% Polyester, not only offers unparalleled comfort but also exudes a sense of style that makes it the perfect companion for your everyday adventures. Whether you're exploring the bustling streets of the city, enjoying a cozy night in, or embarking on a spiritual quest, this hoodie is designed to keep you warm and inspired. With its soft fabric and thoughtful design, it serves as a reminder to embrace the energies around you and to carry your journey of self-discovery wherever you go.
                  </p>
                </div>

                <div className="page-section">
                  <h2 className="type-3xl type-extrabold type-center mt-0 mb-md-responsive">About Shamanicca’s Creator</h2>
                  <div className="page-profile">
                    
                    <img
                      src="https://placehold.co/300x300.png"
                      alt="Shamanicca creator"
                      className="page-profile-image"
                    />
                  </div>
                  <p className="type-paragraph type-medium type-gray-90">
                    At Shamanicca, we wholeheartedly embrace the mystical energies that shape our lives and experiences. Our signature hoodie transcends mere apparel; it symbolizes a transformative journey filled with positivity and spiritual protection. Each piece is lovingly crafted in the vibrant and artistic city of Montreal, where creativity flows like the St. Lawrence River. This classic black hoodie, made from a luxurious blend of 50% Cotton and 50% Polyester, not only offers unparalleled comfort but also exudes a sense of style that makes it the perfect companion for your everyday adventures. Whether you're exploring the bustling streets of the city, enjoying a cozy night in, or embarking on a spiritual quest, this hoodie is designed to keep you warm and inspired. With its soft fabric and thoughtful design, it serves as a reminder to embrace the energies around you and to carry your journey of self-discovery wherever you go.
                  </p>
                </div>

                
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
