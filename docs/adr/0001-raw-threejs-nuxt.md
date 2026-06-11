# Raw Three.js + Nuxt as the 3D stack

The 3D World is built with raw Three.js inside a Nuxt application, without a declarative wrapper layer (TresJS or React Three Fiber). Nuxt handles routing, the Global Menu, and the mobile site. Three.js is used imperatively via Vue composables.

## Considered Options

**TresJS + Nuxt** was the first candidate. TresJS is the Vue-native declarative wrapper for Three.js, equivalent to R3F for React. Rejected because TresJS is ~2 years old with a thin ecosystem — specifically, the character controller and physics support (the hardest part of this build) have few documented examples and no mature wrapper. The declarative benefits are real but amount to saved boilerplate, not solved hard problems.

**React Three Fiber + Next.js** has the strongest ecosystem for this type of project — best character controller examples, largest community, backed by Poimandres. Rejected because the author is Vue/Nuxt-native and not React-comfortable. Taking on React + R3F + Three.js 3D concepts simultaneously on a personal project is three learning curves at once. The ecosystem advantage does not outweigh the context-switch cost.

## Consequences

Raw Three.js requires explicit GPU resource disposal (geometries, materials, textures) when switching Lands or unmounting components. A `useThreeScene()` composable should enforce this pattern consistently to prevent memory leaks.
