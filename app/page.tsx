import Link from "next/link";
import {
  BookOpen,
  Users,
  LineChart,
  ArrowRightCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import WaterDropGrid from "@/components/WaterDropGrid";

export default function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-32 items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full flex items-center gap-4">
        <div className="flex flex-col justify-center z-10">
          <h1 className="text-5xl lg:text-6xl font-black text-neutral-12 whitespace-nowrap">
            Discover Frendere<span className="text-primary-9">.</span>
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl mt-4">
            Master new languages effortlessly with interactive lessons,
            real-time tracking, and community support.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/courses">
              <Button>Explore Courses</Button>
            </Link>
          </div>
        </div>
        <div className="-ml-60">
          <WaterDropGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full flex flex-col gap-12 mt-16">
        <div className="w-full flex justify-between gap-4 items-center">
          <h2 className="text-4xl lg:text-5xl text-center text-neutral-12 whitespace-nowrap font-black">
            Why Frendere<span className="text-primary-9">.</span>
          </h2>
          <div className="h-[1px] w-full bg-neutral-7"></div>
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex w-full gap-6 justify-start items-center">
            <div className="bg-primary-9 p-4 rounded-xl">
              <BookOpen className="w-12 h-12 text-black" strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="H3">Interactive Lessons</h3>
              <p>
                Engage with lessons that adapt to your learning style, ensuring
                you grasp each concept with ease.
              </p>
            </div>
          </div>
          <div className="flex w-full gap-6 justify-start items-center">
            <div className="bg-primary-9 p-4 rounded-xl">
              <LineChart className="w-12 h-12 text-black" strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="H3">Track Your Progress</h3>
              <p>
                Monitor your growth with real-time analytics and personalized
                feedback on your journey to fluency.
              </p>
            </div>
          </div>
          <div className="flex w-full gap-6 justify-start items-center">
            <div className="bg-primary-9 p-4 rounded-xl">
              <Users className="w-12 h-12 text-black" strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="H3">Community Support</h3>
              <p>
                Connect with fellow learners, share tips, and stay motivated
                through a supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="w-full max-w-4xl mt-16">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Join Our Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Get the latest updates, tips, and more directly to your inbox.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-auto"
              />
              <Button variant="default">
                Subscribe <ArrowRightCircle className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action Section */}
      <section className="w-full flex flex-col items-center gap-8 mt-16">
        <h2 className="H2">Ready to Get Started?</h2>
        <p className="text-lg lg:text-xl text-center max-w-lg">
          Sign up today and unlock the full potential of your language learning
          journey.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/login">
            <Button variant="default">
              Start Learning <ArrowRightCircle className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Badges Section */}
      <section className="w-full max-w-4xl mt-16 text-center">
        <h3 className="H3">Trusted by Learners Worldwide</h3>
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Badge variant="secondary">5M+ Users</Badge>
          <Badge variant="secondary">4.8 Rating</Badge>
          <Badge variant="secondary">100K+ Lessons</Badge>
        </div>
      </section>
    </div>
  );
}
