import { Band, SectionHead } from "@/components/blocks";
import { Button } from "@/components/Button";
import {
  BacklashChart,
  Caveat,
  ChartGrid,
  DevsChart,
  DoItRight,
  Fine,
  HiringChart,
  JobsChart,
  Objections,
  PlayersChart,
  ProofNote,
  Reading,
  SkillsChart,
  SteamChart,
  Subhead,
} from "@/components/AiHate";
import { ChartCard, Source, Timeline } from "@/components/Charts";
import { Scene } from "@/components/Scene";
import { ART_TIMELINE, SRC } from "@/content/aihate";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "AI Hate, Jobs and Game Art: What the Data Says | AI Game Makers Club",
  "Getting hate for making games with AI? Explore the numbers on the backlash, jobs and AI game art, with every source linked and guidance on doing it well.",
  "/ai-and-games",
);

export default function AiAndGames() {
  return (
    <>
      <Scene variant="about" compact>
        <span className="eyebrow">AI, hate and your game</span>
        <h1 className="display display--lg">
          Getting hate for building with AI? <em>Here is what the data says.</em>
        </h1>
        <p className="on-sky">
          If you make things with AI, someone may tell you it is not real work. This page takes that seriously. It looks at the numbers on both sides, what is happening to jobs, and how to use AI for your game&apos;s art in a way you can stand behind.
        </p>
        <p className="risk" style={{ justifyContent: "center" }}>
          <span>Every number links to its source</span>
          <span>Both sides shown</span>
          <span>Updated November 2026</span>
        </p>
      </Scene>

      {/* 1. The honest part */}
      <Band tone="dusk" id="hate" labelledBy="hate-title">
        <SectionHead
          id="hate-title"
          eyebrow="First, the honest part"
          title={
            <>
              The backlash is <em>real.</em>
            </>
          }
          intro="Opposition to generative AI in games is strong, and it has grown every year. We should be honest about that."
        />
        <ChartGrid>
          <BacklashChart />
          <PlayersChart />
        </ChartGrid>
        <Caveat title="What that means for you">
          <p>
            The comments can feel personal, but people are often reacting to a flood of careless content and genuine worries about artists and jobs. Those worries deserve a straight answer. Further down, you will find them set out fairly.
          </p>
        </Caveat>
      </Band>

      {/* 2. The shift */}
      <Band tone="cream" id="shift" labelledBy="shift-title">
        <SectionHead
          id="shift-title"
          eyebrow="At the same time"
          title={
            <>
              So is <em>the shift.</em>
            </>
          }
          intro="While the debate continues, these tools have become part of how games and software get made."
        />
        <ChartGrid>
          <SteamChart />
          <DevsChart />
          <ChartCard
            wide
            title="The stores made room for it"
            lede="Neither of the two biggest homes for indie games bans AI. Both ask creators to be open about using it."
            source={
              <>
                <Source href={SRC.steam.href}>{SRC.steam.label}</Source>
                <Source href={SRC.itch.href}>{SRC.itch.label}</Source>
                <Source href={SRC.gdc2026.href}>{SRC.gdc2026.label}</Source>
              </>
            }
          >
            <ul className="check-list">
              <li>Steam changed its rules in January 2024 so most games made with AI can be released, with disclosure.</li>
              <li>itch.io asks creators to disclose generative AI and lets players filter by it.</li>
              <li>36% of game developers told GDC they personally use generative AI tools, the same share as the year before.</li>
            </ul>
          </ChartCard>
        </ChartGrid>
        <ProofNote />
      </Band>

      {/* 3. Jobs */}
      <Band tone="dusk" id="jobs" labelledBy="jobs-title">
        <SectionHead
          id="jobs-title"
          eyebrow="Will AI take my job?"
          title={
            <>
              AI won&apos;t take your place. <em>Someone skilled with it might.</em>
            </>
          }
          intro="Harvard Business Review put that idea in a 2023 headline: people with AI will replace people without it. The numbers since then point in the same direction."
        />
        <ChartGrid>
          <JobsChart />
          <SkillsChart />
          <HiringChart />
          <ChartCard
            title="What that asks of you"
            lede="You do not need a computer science degree for this. You need practice on something real."
          >
            <ul className="check-list">
              <li>Explain clearly what you want built.</li>
              <li>Break it into steps you can check.</li>
              <li>Judge the result, then fix what needs fixing.</li>
              <li>Finish it, and put it in front of people.</li>
            </ul>
          </ChartCard>
        </ChartGrid>
        <Caveat title="The honest caveat">
          <p>
            The change is not painless. Stanford researchers found that employment for 22 to 25 year olds in jobs most exposed to AI has fallen behind, while experienced workers in the same jobs held steady. Experience and judgement still matter, and making real things with these tools helps you develop both.{" "}
            <Source href={SRC.stanford.href}>{SRC.stanford.label}</Source>
          </p>
        </Caveat>
      </Band>

      {/* 4. Art */}
      <Band tone="cream" id="art" labelledBy="art-title">
        <SectionHead
          id="art-title"
          eyebrow="AI and your game's art"
          title={
            <>
              You can use AI <em>for your game&apos;s art.</em>
            </>
          }
          intro="Art direction still takes work. You decide what your game should look like, reject what does not fit and rework what comes close. Those are creative choices, whatever made the first draft."
        />
        <Subhead intro="Tools that made art faster have faced accusations of cheating before becoming widely used.">We have been here before</Subhead>
        <Timeline items={ART_TIMELINE} />

        <Subhead id="right" intro="These choices can shape whether people respect your game or dismiss it.">
          How to do it well
        </Subhead>
        <DoItRight />

        <Subhead intro="These concerns are serious, and you should understand them.">The other side, stated fairly</Subhead>
        <Objections />
        <Fine>This page offers general information, not legal advice. The law varies by country and is still changing.</Fine>
      </Band>

      {/* 5. Sources */}
      <Band tone="dusk" id="sources" labelledBy="sources-title">
        <SectionHead
          id="sources-title"
          eyebrow="Read it yourself"
          title={
            <>
              The sources, <em>in one place.</em>
            </>
          }
          intro="Read the evidence yourself. These are the reports, rulings and articles behind this page."
        />
        <Reading />
      </Band>

      <Band tone="night" labelledBy="final">
        <div className="center" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 id="final" className="display display--lg" style={{ marginBottom: 18 }}>
            Make something you&apos;re proud to <em>put your name on.</em>
          </h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            A finished game people enjoy says more than a reply to the comments. Come and build yours with people who understand.
          </p>
          <div className="cta-row cta-row--center">
            <Button href="/community" size="lg" track="ai_games_final_join">
              Start Free in Skool
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
