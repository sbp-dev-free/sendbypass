import Container from "@mui/material/Container";

import { AboutUs } from "./aboutus";
import { Application } from "./application";
import { Blog } from "./blog";
import { Hero } from "./hero";
import { HowSendbypassWorks } from "./how-sendbypass-works";
import { Opportunities } from "./opportunities";
import { Video } from "./video";
import { YourBelongings } from "./your-belongings";

export const Home = () => {
  return (
    <Container
      sx={{ paddingRight: "0 !important", paddingLeft: "0 !important" }}
      className="!grow !pt-16 md:!pt-24 max-w-[100vw] overflow-hidden"
    >
      <Hero />
      <Container>
        <div className="space-y-80 md:py-64">
          <AboutUs />
          <Opportunities />
          <Video />
          <HowSendbypassWorks />
          <Application />
          <YourBelongings />
          <Blog />
        </div>
      </Container>
    </Container>
  );
};
