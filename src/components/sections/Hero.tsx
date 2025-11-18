import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero">
      <div className="layer" />
      <div className="main">
        
          <h1  className="type-2xl m-0 type-bold">Shamanicca Apparel</h1>
          <p className="type-4xl type-4xl mt-0 mb-md-responsive type-extrabold">Intentioned Mystical Style</p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/shop/women"
              className="btn btn-white btn-medium"
            >
              SHOP WOMEN’S
            </Link>
            <Link
              href="/shop/men"
              className="btn btn-white ml-30 btn-medium"
            >
              SHOP MEN’S
            </Link>
          </div>
        
      </div>
      <div className="bg-image">
        <Image src="/images/hero-image.png" alt="Shamanicca Collection" fill priority style={{ objectFit: 'cover' }} />
      </div>
    
    </section>
  );
}
