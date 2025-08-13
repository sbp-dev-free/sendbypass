import { WordsPullUp } from "@/components/shared";

import { PRIVATE_ROUTES } from "../routes";

export const DESKTOP_TABS = [
  {
    label: (
      <span className="flex">
        <span className="hidden md:block "> Request to Passengers </span>
        <span className="md:hidden block"> Passengers </span>
      </span>
    ),
    value: "request-to-passengers",
    icon: "",
  },
  {
    label: (
      <span className="flex">
        <span className="hidden md:block "> Start to Ship </span>
        <span className="md:hidden block"> Shipping </span>
      </span>
    ),

    value: "start-to-ship",
    icon: "",
  },
  {
    label: (
      <span className="flex">
        <span className="hidden md:block "> Start to Shop </span>
        <span className="md:hidden block"> Shopping </span>
      </span>
    ),

    value: "start-to-shop",
    icon: "",
  },
];

export const OPPORTUNITIES = [
  {
    id: 1,
    icon: "plane take off",
    title: "As a Passenger",
    caption: "Earn money and travel for free",
    href: PRIVATE_ROUTES.trips.create,
  },
  {
    id: 2,
    icon: "Shopping bag remove",
    title: "As a Shopper",
    caption: "Buy everything from anywhere",
  },
  {
    id: 3,
    icon: "bag",
    title: "As a Sender",
    caption: "Send your luggage quickly and affordably",
  },
];

export const HOW_SENDBYPASS_WORKS_TABS = [
  {
    label: "As a passenger",
    value: "passenger",
  },
  {
    label: "As a sender",
    value: "sender",
  },
  {
    label: "As a shopper",
    value: "shopper",
  },
];

export const SHOPPER_TAB_CONTENT = [
  {
    id: 1,
    label: "Tell us about your order",
  },
  {
    id: 2,
    label: "Find a passenger and make an offer or wait for them to make offers",
  },
  {
    id: 3,
    label: "Confirm details with your passenger",
  },
];

export const PASSENGER_TAB_CONTENT = [
  {
    id: 1,
    label: "Tell us about your trips",
  },
  {
    id: 2,
    label:
      "Find an order you can deliver from sender or shopper and make an offer or wait for them to make offers",
  },
  {
    id: 3,
    label: "Confirm details with your sender or shopper",
  },
];

export const SENDER_TAB_CONTENT = [
  {
    id: 1,
    label: "Tell us about your trips",
  },
  {
    id: 2,
    label: "Find a passenger and make an offer or wait for them to make offers",
  },
  {
    id: 3,
    label: "Confirm details with your passenger",
  },
];

export const BELONGING_ITEMS = [
  {
    id: 1,
    icon: "Secure Tracking",
    title: "Secure Tracking",
    caption: "Follow your items in real-time with your profile",
  },
  {
    id: 2,
    icon: "Transparent Pricing",
    title: "Transparent Pricing",
    caption: "Clear rates with no hidden charges or surprises",
  },
  {
    id: 3,
    icon: "Verified Users",
    title: "Verified Users",
    caption: "Every are vetted and background-checked",
  },
  {
    id: 4,
    icon: "Money-Back Promise",
    title: "Money-Back Promise",
    caption: "100% satisfaction guaranteed or your money back",
  },
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "London Heathrow Airport, United Kingdom (LHR)",
    href: "https://sendbypass.com/blog/london-heathrow-airport-united-kingdom-lhr/",
    image:
      "https://sendbypass.com/blog/wp-content/uploads/2025/02/Heathrow-Airport.png",
    readTime: "4 min",
  },
  {
    id: 2,
    title: "Denver International Airport, United States (DEN)",
    href: "https://sendbypass.com/blog/denver-international-airport/",
    image:
      "https://sendbypass.com/blog/wp-content/uploads/2025/02/denver-international-airport.webp",
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Why Crowdsource Shipment is Necessary in Modern Era",
    href: "https://sendbypass.com/blog/why-crowdsource-shipment-is-necessary-in-modern-era/",
    image:
      "https://sendbypass.com/blog/wp-content/uploads/2025/02/Why-Crowdsource-Shipment-is-Necessary-in-Modern-Era-1.webp",
    readTime: "3 min",
  },
  {
    id: 4,
    title: "Comparison between Different Methods of Shipments: Pros and Cons",
    href: "https://sendbypass.com/blog/comparison-between-different-methods-of-shipments-pros-and-cons/",
    image:
      "https://sendbypass.com/blog/wp-content/uploads/2025/02/Traditional-Courier-Services.webp",
    readTime: "4 min",
  },
];

export const SLIDES_TEXT = [
  <h3
    key={0}
    className="text-center flex-wrap flex max-w-[350px] justify-center gap-4 text-wrap md:max-w-[800px] lg:max-w-fit md:w-full mx-auto text-primary lg:text-nowrap lg:text-start transition-opacity duration-500 text-[18px] font-light md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
  >
    <WordsPullUp
      preText="Need to "
      postText="Request to Passengers"
      text="Send or Shop something?"
      className="text-[18px] font-bold md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
    ></WordsPullUp>
  </h3>,
  <h3
    key={1}
    className="text-center flex-wrap flex max-w-[350px] justify-center gap-4 text-wrap md:max-w-[800px] lg:max-w-fit md:w-full mx-auto text-primary lg:text-nowrap lg:text-start transition-opacity duration-500 text-[18px] font-light md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
  >
    <WordsPullUp
      preText="Want to"
      postText="Start to Shop"
      text="travel for free by shopping for others?"
      className="text-[18px] font-bold md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
    ></WordsPullUp>
  </h3>,
  <h3
    key={2}
    className="text-center flex-wrap flex max-w-[350px] justify-center gap-4 text-wrap md:max-w-[800px] lg:max-w-fit md:w-full mx-auto text-primary lg:text-nowrap lg:text-start transition-opacity duration-500 text-[18px] font-light md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
  >
    <WordsPullUp
      preText="Ready to"
      text="earn money while you travel by delivering items?"
      postText=" Start to Ship"
      className="text-[18px] font-bold md:text-[26px] md:leading-[56px] tracking-[-0.5px]"
    ></WordsPullUp>
  </h3>,
];
export const TUTORIALS = [
  {
    title: "Join SendByPass Community in Seconds",
    text: "Sign up effortlessly on SendByPass to start connecting travelers with shipping or shopping needs. Create your account and unlock a world of seamless logistics.",
    open: true,
    video: "https://sendbypass.com/media/sign_in.m4v",
  },
  {
    title: "Plan Your Trip, Help Others",
    text: "Register your travel plans on SendByPass and offer to carry or shop for items during your journey. Turn every trip into a chance to help others with their shipping or shopping needs while earning rewards.",
    open: false,
    video: "https://sendbypass.com/media/add_trip.m4v",
  },
  {
    title: "Send with Ease, Reach the World",
    text: "Send your packages internationally without the hassle. With SendByPass, simply create a request and a traveler from our network will securely and affordably deliver your items, making global shipping straightforward.",
    open: false,
    video: "https://sendbypass.com/media/add_shipping.m4v",
  },
  {
    title: "Shop Globally, Delivered by Our Community",
    text: "Unlock endless shopping options from around the globe. Place your orders, and SendByPass travelers will efficiently transport your purchases to you, offering a smart and cost-effective solution for international shopping.",
    open: false,
    video: "https://sendbypass.com/media/add_shopping.m4v",
  },
];
