import type { Component } from 'solid-js';

import Header from './_components/Header';
import Footer from './_components/Footer';
import Socials from './_components/Socials';

const documentProps = {
  title: 'Chilfish',
  description: 'Chilfish, Developer.',
};

const Page: Component = () => {
  return (
    <main class="px-6 py-[8vh] max-w-[70ch] mx-auto xl:text-lg dark:prose-invert">
      <Header />
      <Socials />
      <Footer />
    </main>
  );
};

export { Page, documentProps };
