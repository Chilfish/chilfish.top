import helloWordArr from '../hello';
import Hero from './Hero';

export default () => {
  const helloWord = helloWordArr[Math.floor(Math.random() * helloWordArr.length)];

  return (
    <header class="mt-12 md:mt-18 flex justify-between">
      <div>
        <h1 class="title text-4xl font-bold sm:text-5xl">
          <span class="block">{helloWord}, </span>
          <span class="block mt-2">I'm Chilfish.</span>
        </h1>
        <p class="my-6">Front-end developer (maybe).</p>
      </div>
      <Hero />
    </header>
  );
};
