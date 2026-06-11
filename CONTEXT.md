# CONTEXT.md

## Glossary

### The World
The interactive 3D environment that constitutes brianyamabe.com. Organized as a hub-and-spoke layout inspired by Disneyland. Design philosophy draws from Walt Disney's principles: visual magnets (weenies), environmental storytelling, forced perspective, and detail at every level of approach.

### The Hub
The central node of the hub-and-spoke layout. Contains the Cathedral and the surrounding plaza. All five Lands radiate from the Hub. Visitors arrive at the Hub via the Bridge.

### The Cathedral
The central landmark of the Hub. A purpose-built architectural fusion: stone base, timber upper structure, split roof combining a Western gable and upturned Japanese eave. Neither Gothic nor temple — a new form that treats both Lutheran and Japanese identity as equally load-bearing. Functions as the weenie: visible and legible from every Land.

### The Bridge
The stone bridge over water that marks the arrival threshold. The first element a visitor encounters. Water beneath it serves as a natural visual anchor for the entry sequence. The Cathedral is visible beyond it.

### The Lands
The five explorable areas radiating from the Hub, each representing a distinct facet of Brian's identity:

- **Lutheran** — directly ahead from the Cathedral (primary axis)
- **Lutheran Media** — to the left of Lutheran; adjacent to Lutheran (shares a border)
- **Japanese** — to the right of Lutheran
- **Software** — behind the Cathedral to the left; touches Lutheran Media
- **Walt Disney / Disneyland** — behind the Cathedral to the right

### The Character
The visitor's avatar. A stylized, low-poly representation of Brian — a Japanese-American man whose appearance signals the intersection of his identities. The character is what the visitor embodies as they traverse The World. It is Brian in the same way Bruno Simon's car is Bruno Simon.

### Landmark
An interactive object or building within a Land. Clicking a Landmark triggers an experience — audio, visual, or a brief text panel. Landmarks are the primary content unit of The World. They demonstrate rather than explain.

### Border Zone
The visual and spatial transition between two adjacent Lands. May contain shared Landmarks that belong to both identities. The Lutheran / Lutheran Media border and the Lutheran Media / Software border are the two active Border Zones in The World.

### Sub-Zone
A distinct area within a Land that tells its own story while remaining part of the larger Land. The Japanese Land contains two Sub-Zones. Sub-Zones are separated by a soft transition — terrain shift, light change, material change — not a hard border or label. The transition itself carries narrative meaning.

### Japanese Heritage Sub-Zone
The Japan-facing half of the Japanese Land. Represents the source culture: Edo period, martial history, the Japanese language, and classical Japanese aesthetics. Weenie: a Himeji Castle element. Architectural language: stone, timber, historical scale.

### Ambient Audio
Each Land has its own subtle ambient audio loop. Audio transitions as the character crosses into a new Land — the sound of the destination heard before it is fully seen, per Walt Disney's approach. A mute control is always accessible. Audio is background texture, not performance.

### Content Strategy
Landmark Info Panel content and Land-specific content lives in flat files (JSON or Markdown) in the repo. Lutheran Media content has two sources that merge at runtime: the Synod Stories RSS feed (podcast episodes, fetched automatically via a Nuxt server route) and a supplementary JSON file in the repo (non-podcast items such as documentary pieces or other Lutheran Media work). No CMS. Content updates to the podcast feed require no deploy; supplementary content updates require a commit.

### V1 Scope
The first shippable version contains: the Hub (Bridge, Cathedral), the Lutheran Land with all Landmarks, the Global Menu (all five Lands present in content form), the Character with basic movement and Landmark interaction. All other Lands exist as placeholder terrain. Content for unbuilt Lands is accessible via the Global Menu from day one.

### Asset Workflow
Hero pieces (Cathedral, major Landmarks) built in Spline, exported as GLTF. Props and fill assets from Meshy.ai (AI-generated) or free packs. Textures from Spline AI or Poly Haven. Character mesh from Quaternius free low-poly character pack, customized in Spline. Character rigging and animations from Mixamo (free). Scene assembled in Three.js.

### Technical Stack
Nuxt 4 / Vue 3 / TypeScript. Raw Three.js via Vue composables for the 3D World. No declarative wrapper (TresJS or R3F). pnpm for package management. Deployed to Cloudflare Pages + Workers — Workers handle server-side routes including RSS feed fetching. Domain registered via Hover, DNS via Cloudflare. See ADR-0001 for the Three.js stack decision.

### Platform Split
The 3D World is a desktop-only experience. Mobile visitors receive the Global Menu as the complete site — not a fallback or degraded experience, but the full content layer in a traditional format. No apology, no "please visit on desktop" gate for the content itself.

### Art Style
Low-poly with warm materials. Geometric, stylized, minimal triangles. Warm earth tones, wood and stone textures, soft light. Warmth comes from color and lighting rather than surface detail. Differentiates from Bruno Simon's cooler palette. Fits the timber, stone, and candlelight aesthetic language of both the Lutheran and Japanese identities.

### Walt Disney / Disneyland Land
The Land representing Brian's personal relationship to Disneyland and Walt Disney's creative philosophy. Anchor: personal Disney memories — specific, experiential, Brian's Disneyland rather than Disney as a corporation. Depth layer: Walt's design philosophy and Imagineering principles, available to visitors who explore further. The meta-tension (Disneyland inspires the whole World) is not resolved by explanation — the Land earns its place by being genuinely personal.

### Software Land Aesthetic
The Software Land reads as a craftsman's workshop — forge, bench, tools. The framing is vocation and skilled labor, not corporate or infrastructure. Specific companies and technologies are not the subject; the human act of building software is. Landmarks represent craft, accumulated knowledge, the AI frontier, and the overlap with media production at the Lutheran Media border.

### Japanese-American Sub-Zone
The Japanese-American-facing half of the Japanese Land. Represents the generational experience in America: the Yamabe family, community, food culture, and heritage reclamation. The internment history is honored as something that shaped the family without defining it — present but not dominant. Anchor: a family home with engawa. Architectural language: domestic, intimate, mid-century Japanese-American.

### Info Panel
The optional text layer accessible on a Landmark. Appears on click or a secondary interaction. Provides a plain-language explanation for visitors who want context without disrupting the experience for those who don't.

### The Global Menu
A navigation overlay accessible from anywhere in The World. Allows direct access to any Land or content item without traversal. On desktop: a slide-out panel that coexists with the 3D World without covering it. On mobile: the complete site in standard navigation form. The mobile experience is not a fallback — it is the full content layer in a different format.
