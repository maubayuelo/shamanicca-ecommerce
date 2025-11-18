import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="main">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-heading type-md type-extrabold type-uppercase m-0">Get The Good Stuff</h3>
            <p className="footer-text type-md">
              We’re not into spam. Just: product drops and juicy updates.
              Hit subscribe and save – your inbox will thank you. 😉
            </p>

            <form className="newsletter-form mt-15" onSubmit={(e) => e.preventDefault()}>
              <input className="type-sm" aria-label="email" placeholder="Your Email" type="email" name="email" />
              <button className="newsletter-submit type-sm type-extrabold type-uppercase" type="submit">Send</button>
            </form>

            <div className="social mt-xl-responsive mb-lg-responsive">
              <div className="label type-sm mb-sm-responsive">Catch updates following us on:</div>
              <div className="icons">
                <a className="icon" href="#" aria-label="Instagram">
                  <Image src="/images/icons/icon-social-ig.svg" alt="Instagram" width={30} height={30} />
                </a>
                <a className="icon" href="#" aria-label="YouTube">
                  <Image src="/images/icons/icon-social-yt.svg" alt="YouTube" width={30} height={30} />
                </a>
                <a className="icon" href="#" aria-label="TikTok">
                  <Image src="/images/icons/icon-social-tt.svg" alt="TikTok" width={30} height={30} />
                </a>
              </div>
            </div>

          </div>

          <div className="footer-col">
            <h4 className="footer-heading type-md type-extrabold type-uppercase m-0">About</h4>
            <p className="footer-text type-md">
              All of our apparel is responsibly sourced and ethically manufactured. Each item is printed just for you, and ships within 7 days. We make t-shirts, they make statements.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading type-md type-extrabold type-uppercase m-0">Explore</h4>
            <ul className="mt-md-responsive">
              <li className="type-md">About Us</li>
              <li className="type-md">Giving Back</li>
              <li className="type-md">Returns & Exchanges</li>
              <li className="type-md">Size Chart</li>
              <li className="type-md">Visual Size Guide</li>
              <li className="type-md">Prana Points</li>
              <li className="type-md">FAQs</li>
              <li className="type-md">Contact Us</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading type-md type-extrabold type-uppercase m-0">Customer Service</h4>
            <ul className="mt-md-responsive">
              <li className="type-md">Search</li>
              <li className="type-md">Returns & Exchanges</li>
              <li className="type-md">Help Center / FAQ</li>
              <li className="type-md">Contact Us</li>
              <li className="type-md">Privacy Policy</li>
              <li className="type-md">Terms & Conditions</li>
            </ul>
            <div className="copyright mt-lg-responsive type-md">©{new Date().getFullYear()} Shamanicca</div>
          </div>
        </div>

        
      </div>
    </footer>
  );
}
