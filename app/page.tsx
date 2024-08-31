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

export default function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center justify-center">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-6">
        <h1 className="H1">Welcome to Frendere</h1>
        <p className="text-lg lg:text-xl max-w-2xl">
          Master new languages effortlessly with interactive lessons, real-time
          tracking, and community support.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/login">
            <Button variant="default">
              Get Started <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline">Explore Courses</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full flex flex-col gap-12 mt-16">
        <h2 className="H2">Why Frendere?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-primary-9 mx-auto mb-4" />
              <CardTitle className="text-2xl">
                Engaging Interactive Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">
                Engage with lessons that adapt to your learning style, ensuring
                you grasp each concept with ease.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <LineChart className="w-12 h-12 text-primary-9 mx-auto mb-4" />
              <CardTitle className="text-2xl">Track Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">
                Monitor your growth with real-time analytics and personalized
                feedback on your journey to fluency.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-primary-9 mx-auto mb-4" />
              <CardTitle className="text-2xl">Community Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">
                Connect with fellow learners, share tips, and stay motivated
                through a supportive community.
              </p>
            </CardContent>
          </Card>
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
