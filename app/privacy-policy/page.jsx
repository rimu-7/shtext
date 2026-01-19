import Link from "next/link";
import { Shield, Eye, Database, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

export const metadata = {
  title: "Privacy Policy | Sh...TEXT",
  description: "How we handle (and don't handle) your data.",
};

export default function PrivacyPolicy() {
  return (
    <Container className="py-5">
      <div className="w-full space-y-12">
        {/* HEADER */}
        <section className="space-y-6 text-center sm:text-left border-b-2 border-black dark:border-white pb-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase drop-shadow-[4px_4px_0_var(--shadow-color)] dark:drop-shadow-[2px_3px_0_var(--shadow-dark-color)] ">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl font-medium text-muted-foreground font-mono max-w-2xl">
            We don't want your data. We don't sell your data. We can't even read
            your data.
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        {/* SECTION 1: THE DATA */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
              <Database className="h-6 w-6" /> What We Store
            </h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              When you create a snippet, we create a single document in our
              MongoDB database.
              <br />
              <br />
              <strong>On the right</strong> is a real example of what a saved
              snippet looks like in our database.
            </p>
          </div>

          {/* THE JSON SNIPPET UI */}
          <div className="md:col-span-2 relative group">
            <div className="relative bg-[#1e1e1e] border-2 border-black dark:border-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] overflow-hidden">
              {/* Fake Terminal Header */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-mono text-gray-400">
                  mongodb_viewer.exe
                </span>
              </div>

              {/* The Code */}
              <pre className="font-mono text-xs text-green-400 overflow-x-auto custom-scrollbar">
                {`{
  "_id": { "$oid": "696e083e..." },
  
  // 🔒 THIS IS YOUR CONTENT (AES-256 Encrypted)
  "content": "f11b11586ce03a29d3fa...:08ffc4c84473ea64...",
  
  "slug": "PostmanTest01",

  // 🔑 THIS IS YOUR PASSWORD (Bcrypt Hash)
  "password": "$2b$10$jyiZNRBU51HXS1qQC5lcL...",
  
  // ⏳ SELF-DESTRUCT TIMER
  "expireAt": { "$date": "2026-01-19T11:32:30.573Z" },
  "createdAt": "2026-01-19T10:32:30.574Z"
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 2: BREAKDOWN */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black uppercase border-l-8 border-primary pl-4">
            The Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PolicyCard icon={<Lock />} title="Encryption">
              Your text is encrypted using <strong>AES-256-CBC</strong> before
              it leaves our server. The random string you see in{" "}
              <code>"content"</code> is unreadable without the secret key.
            </PolicyCard>

            <PolicyCard icon={<Eye />} title="Passwords">
              We do not store plain-text passwords. We store a{" "}
              <strong>Bcrypt Hash</strong> (that scary looking string starting
              with <code>$2b$10$</code>). We can verify your password matches,
              but we cannot tell you what it is.
            </PolicyCard>

            <PolicyCard icon={<Shield />} title="No Analytics">
              We do not use Google Analytics, Facebook Pixel, or any third-party
              trackers. We use a simple server-side counter for rate limiting
              (Upstash) to prevent abuse.
            </PolicyCard>

            <PolicyCard icon={<Database />} title="Deletion">
              The <code>expireAt</code> field tells MongoDB when to delete this
              document. Once that time is reached, the data is permanently
              erased from the hard drive.
            </PolicyCard>
          </div>
        </section>

        {/* BACK BUTTON */}
        <div className="pt-8 border-t-2 border-black/10 dark:border-white/10 flex justify-center">
          <Link href="/">
            <Button className="h-12 px-8 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all font-bold text-base bg-primary text-primary-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

function PolicyCard({ icon, title, children }) {
  return (
    <div className="border-2 border-black dark:border-white p-6 bg-card dark:hover:drop-shadow-[4px_4px_0_var(--shadow-dark-color)] hover:drop-shadow-[4px_4px_0_var(--shadow-color)] duration-300   transition-colors">
      <div className="flex items-center gap-3 mb-3 text-primary">
        {icon}
        <h3 className="text-xl font-black uppercase">{title}</h3>
      </div>
      <p className="font-mono text-sm text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}
