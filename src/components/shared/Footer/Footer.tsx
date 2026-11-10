import logo from "@/assets/images/common-image/logo.png";
import Container from "../Container";
import google_play from "@/assets/images/common-image/google_play.png";
import apple_store from "@/assets/images/common-image/Apple_Store.webp";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CountryCurrencyModal from "./CountryCurrencyModal";

const BuyLinks = [
  {
    id: 1,
    name: "Shop",
    link: "/shop",
    prefetch: true
  },
  {
    id: 2,
    name: "Order Tracking",
    link: "/order-tracking",
    prefetch: true
  },
  {
    id: 3,
    name: "Returns",
    link: "/returns",
    prefetch: true
  },
];

const SellLinks = [
  {
    id: 1,
    name: "Sell",
    link: "/sell",
    prefetch: false
  },
  {
    id: 2,
    name: "Donate",
    link: "/donate",
    prefetch: true
  },
  {
    id: 3,
    name: "Assisted seller",
    link: "/assisted-seller",
    prefetch: false
  },

];

const pagesLinks = [
  {
    id: 1,
    name: "About Us",
    link: "/about-us"
  },
  {
    id: 2,
    name: "Explore Roles",
    link: "/user-details"
  },
  {
    id: 3,
    name: "Contact",
    link: "/contact-us"
  },
  {
    id: 4,
    name: "Privacy Policy",
    link: "/privacy-policy"
  },
  {
    id: 5,
    name: "Terms & Conditions",
    link: "/terms-use"
  }
];

const socialIcons = [
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
  { icon: Instagram, label: "Instagram" }
];

function FooterColumn({ links, title }: { title: string, links: { name: string; link: string, id: number, prefetch?: boolean }[] }) {
  return (
    <div>
      <h3 className="text-white text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link?.id}>
            <Link
              href={link?.link}
              prefetch={link?.prefetch}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              {link?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-gray-300" >
      <Container>

        <div >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {/* Brand column */}
              <div>
                <h2 className="text-white text-4xl font-bold mb-4">FASHI-ON</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                  Welcome to FASHI-ON, your ultimate destination for fashion enthusiasts.
                </p>



                <div className="flex gap-4 sm:flex-col">
                  <Link href="#">
                    <Image src={google_play} alt="Google Play" width={500} height={200} className="object-contain h-10 w-auto" />
                  </Link>
                  <Link href="#">
                    <Image src={apple_store} alt="App Store" width={500} height={200} className="object-contain h-10 w-auto" />
                  </Link>
                </div>

              </div>

              <FooterColumn title="Buy" links={BuyLinks} />
              <FooterColumn title="Sell" links={SellLinks} />
              <FooterColumn title="Pages" links={pagesLinks} />
            </div>
          </div>

          <div className="border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400 text-center md:text-left">
                Copyright &copy; {new Date().getFullYear()}{" "}
                <Link
                  href="#"
                  className="text-white underline hover:text-gray-100"
                >
                  FASHI-ON.
                </Link>{" "}
                All Rights Reserved
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <CountryCurrencyModal />

                <div className="flex flex-row items-center gap-3">
                  {socialIcons.map(({ icon: Icon, label }) => (
                    <Link
                      key={label}
                      href="#"
                      aria-label={label}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors group"
                    >
                      <Icon className="w-3.5 h-3.5 text-white " />
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;
