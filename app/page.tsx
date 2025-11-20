import { Hero } from "@/components/home/Hero";
import { UpcomingMatches } from "@/components/home/UpcomingMatches";
import { FeaturedLeagues } from "@/components/home/FeaturedLeagues";

export default function Home() {
  return (
    <div className="space-y-8">
      <Hero />
      <FeaturedLeagues />
      <section>
        <h2 className="text-h2 font-semibold mb-4">Upcoming Matches</h2>
        <UpcomingMatches />
      </section>
    </div>
  );
}
