import Link from "next/link";
import { BookOpen, Users, Globe, Sparkles } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Reading",
      desc: "Carefully selected books and content to match your interests and learning goals.",
    },
    {
      icon: Users,
      title: "Community Driven",
      desc: "Built for readers, by readers — connect, share, and grow together.",
    },
    {
      icon: Globe,
      title: "Read Anywhere",
      desc: "Your reading journey continues seamlessly across devices, wherever you go.",
    },
    {
      icon: Sparkles,
      title: "Smart Experience",
      desc: "Personalized recommendations and smooth UX designed for focus and joy.",
    },
  ];

  return (
    <section className="min-h-screen bg-base-100 px-6 py-20 inter">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl playfair">
            About <span className="text-primary">Read Mart</span>
          </h1>

          <p className="mx-auto max-w-3xl text-base-content/70">
            Read Mart is a modern reading platform designed to help people
            discover, enjoy, and stay consistent with reading — anytime,
            anywhere.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
            <p className="leading-relaxed text-base-content/70">
              Our mission is to make reading a natural part of everyday life.
              Whether you&apos;re commuting, taking a break, or winding down, Read On
              Route helps you stay connected with knowledge, stories, and ideas
              that matter.
            </p>
          </div>

          <div className="rounded-2xl bg-base-200 p-8 shadow-lg">
            <p className="text-lg font-medium">
              “Reading should move with you — not wait for you.”
            </p>
            <span className="mt-4 block text-sm text-base-content/60">
              — Read On Route Philosophy
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl bg-base-200 p-6 shadow-md transition-all"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Icon size={24} />
                </div>

                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-base-content/70">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h3 className="mb-4 text-2xl font-semibold">Join the Journey</h3>

          <p className="mx-auto mb-6 max-w-2xl text-base-content/70">
            Read Mart is more than an app — it&apos;s a habit, a community, and a
            smarter way to read in a busy world.
          </p>

          <Link href="/allbooks" className="btn btn-primary px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 playfair">
            Start Reading
          </Link>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;