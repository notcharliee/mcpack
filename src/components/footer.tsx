import particles from "~/assets/particles.png"
import bee from "~/assets/bee.png"

import pollinate1 from "~/assets/audio/pollinate1.ogg"
import pollinate2 from "~/assets/audio/pollinate2.ogg"

export const Footer = () => (
  <footer className="bg-card py-8 md:py-12 border-t-2">
    <div className="relative container mx-auto">
      <div className="flex flex-col gap-2 text-balance">
        <h4 className="text-2xl leading-none font-serif-heading text-foreground">
          Thanks for using my app!
        </h4>
        <p className="text-lg text-muted-foreground leading-tight">
          You can find more cool stuff like this on my{" "}
          <a href="https://charliee.dev">portfolio page.</a>
          <br className="max-sm:hidden" />
          <span className="sm:hidden"> </span>
          If you can spare some change,{" "}
          <a href="https://www.buymeacoffee.com/notcharliee">
            buy me a coffee!
          </a>
        </p>
      </div>
      <button
        className="size-[109px] absolute -top-8 right-8 rotate-12 hidden min-[700px]:block group"
        onClick={() => {
          const arr = [new Audio(pollinate1), new Audio(pollinate2)]
          const sfx = arr[Math.floor(Math.random() * arr.length)]

          sfx.play()
          arr.forEach((el) => el.remove())
        }}
      >
        <img
          src={particles}
          draggable={false}
          className="w-2/3 absolute right-0 top-0"
        />
        <img
          src={bee}
          draggable={false}
          className="w-2/3 absolute left-0 bottom-0 group-active:animate-bzz"
        />
      </button>
    </div>
  </footer>
)
