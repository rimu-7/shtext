import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About | Sh...TEXT",
  description: "Learn about the security and mission behind Sh...TEXT",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl space-y-12">
        {/* HERO SECTION */}
        <section className="space-y-6 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase drop-shadow-[4px_4px_0_var(--shadow-color)]">
            The Manifesto
          </h1>
          <p className="text-lg sm:text-xl font-medium text-muted-foreground font-mono leading-relaxed max-w-2xl">
            We built Sh...TEXT because sending passwords over Slack, Discord, or
            Email is a security nightmare. We believe in{" "}
            <strong>transient data</strong>—information that exists only as long
            as it needs to.
          </p>
        </section>

        {/* CARDS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Zero Knowledge">
            We encrypt your data <strong>before</strong> it enters our database.
            Even if we wanted to read your notes, we can't. The decryption
            happens only when the intended recipient opens the link.
          </InfoCard>

          <InfoCard title="Self-Destruct">
            Data is a liability. Every snippet created on this platform has a
            TTL (Time To Live). Once the timer hits zero, the database record is
            permanently wiped by MongoDB.
          </InfoCard>

          <InfoCard title="Open Source">
            Security through obscurity is a myth. Our code is open for audit on
            GitHub. You can verify exactly how we handle encryption and rate
            limiting.
          </InfoCard>

          <InfoCard title="Anti-Abuse">
            We utilize Upstash Redis for aggressive rate limiting to prevent
            brute-force attacks and spam, ensuring the service remains fast and
            available for everyone.
          </InfoCard>
        </section>

        {/* CONTACT SECTION */}
        <section className="bg-card border-2 border-black dark:border-white p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Get in Touch
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              Found a bug? Have a feature request? Or just want to say hi?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="mailto:rimu_mutasim@yahoo.com">
              <Button className="w-full sm:w-auto h-12 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all font-bold text-base bg-primary text-primary-foreground">
                Email Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/" target="_blank">
              {/* Just a secondary button style example */}
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all font-bold text-base"
              >
                <Link href="/https://github.com/rimu-7/shtext" target="_blank">
                  View on GitHub
                </Link>
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// Helper component for cleaner code
function InfoCard({ title, children }) {
  return (
    <div className="bg-background border-2 border-black dark:border-white p-6 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all duration-300">
      <h3 className="text-lg font-black uppercase mb-3 text-primary border-b-2 border-black/10 dark:border-white/10 pb-2">
        {title}
      </h3>
      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
