import { createTw } from "react-pdf-tailwind";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/inter/Inter_18pt-Regular.ttf`,
    },
    {
      src: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/inter/Inter_18pt-ExtraBold.ttf`,
      style: "extrabold",
    },
  ],
});

export const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Inter"],
    },
    extend: {
      colors: {
        customPurple: "#af57db",
      },
    },
  },
});
