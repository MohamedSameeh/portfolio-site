import { About } from "@/components/about";
import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Process } from "@/components/process";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Work } from "@/components/work";
import { DocumentDirection } from "@/lib/app-state";

export default function Home() {
  return (
    <>
      <DocumentDirection />
      <SmoothScroll />
      <Navbar />
      <main data-page>
        <Hero />
        <Capabilities />
        <Work />
        <Process />
        <About />
        <Contact />
      </main>
    </>
  );
}
