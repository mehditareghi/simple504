"use client";

export default function Features() {
  const items = [
    {
      id: 1,
      title: "Interactive Lessons",
      description:
        "Experience dynamic, adaptive lessons that cater to your unique learning style. Whether you prefer hands-on practice, quizzes, or step-by-step instructions, Frendere’s lessons are designed to keep you engaged and ensure deep understanding.",
    },
    {
      id: 2,
      title: "Real-Time Progress Tracking",
      description:
        "Monitor your language learning journey with real-time analytics. Frendere’s intuitive dashboard provides insights into your progress, helping you stay on track and focused on your goals. Track your vocabulary growth, grammar mastery, and overall language proficiency.",
    },
    {
      id: 3,
      title: "Comprehensive Learning Paths",
      description:
        "Embark on a structured journey with courses tailored to different aspects of language learning, from vocabulary building to mastering grammar. Frendere offers specialized courses like “504 Essential Words” and “Irregular Verbs,” ensuring you cover all essential language skills.",
    },
    {
      id: 4,
      title: "Community Support",
      description:
        "Join a vibrant community of learners from around the world. Share tips, exchange experiences, and stay motivated by connecting with others who are on the same journey. Frendere’s community forums and group learning sessions foster a collaborative learning environment.",
    },
    {
      id: 5,
      title: "Personalized Learning Experience",
      description:
        "Frendere adapts to your learning pace, offering personalized content recommendations and reminders based on your progress and preferences. The platform’s AI-driven engine ensures that you’re always challenged but never overwhelmed.",
    },
    {
      id: 6,
      title: "Multi-Modal Learning Tools",
      description:
        "From listening exercises to writing practices, Frendere provides a variety of tools to help reinforce what you’ve learned. These multi-modal approaches ensure that you can apply your new language skills in real-life situations, enhancing retention and fluency.",
    },
    {
      id: 7,
      title: "Gamified Learning",
      description:
        "Stay motivated with Frendere’s gamification features. Earn badges, complete challenges, and track your streaks to make your learning journey enjoyable and rewarding. The more you learn, the more achievements you unlock!",
    },
  ];
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="break-inside-avoid bg-primary-3 mb-4 p-4 rounded-md"
        >
          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
