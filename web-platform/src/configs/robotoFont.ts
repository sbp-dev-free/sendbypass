import localFont from "next/font/local";

export const robotoFont = localFont({
  src: [
    {
      path: "../../public/fonts/Roboto-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-ThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/Roboto-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Roboto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Roboto-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Roboto-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Roboto-Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-BlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
});
