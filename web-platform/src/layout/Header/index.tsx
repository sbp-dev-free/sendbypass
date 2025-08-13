import Container from "@mui/material/Container";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants";

import logo from "../../../public/images/logo.svg";

import ClientSideHeader from "./ClientSideHeader";
import { Nav } from "./Nav";

export const Header = () => {
  return (
    <header>
      <div className="flex justify-center items-center h-80 bg-surface-container">
        <Container className="flex justify-between items-center">
          <div className="flex gap-32 items-center">
            <Link href={ROUTES.home}>
              <Image src={logo} alt="logo" width={140} height={20} />
            </Link>
            <Nav />
          </div>
          <ClientSideHeader />
        </Container>
      </div>
    </header>
  );
};
