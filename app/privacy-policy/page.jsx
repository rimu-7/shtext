import { Shield, EyeOff, Trash2, KeyRound, Terminal, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6">
      
      {/* --- Section Header --- */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          The Safe House Protocol
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We don't just hide your data; we destroy it. Learn how our architecture ensures your secrets remain secrets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* --- Visual: The "Encrypted Code" Representation --- */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl overflow-hidden border border-gray-800 relative group">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <Terminal className="h-5 w-5 text-green-500" />
            <span className="text-gray-400 text-sm font-mono">system_encryption.log</span>
          </div>
          
          <div className="space-y-2 font-mono text-xs sm:text-sm">
             <div className="flex gap-2">
                <span className="text-blue-400">INPUT:</span>
                <span className="text-white">"Project Alpha Launch Codes"</span>
             </div>
             <div className="flex gap-2">
                <span className="text-purple-400">PROCESS:</span>
                <span className="text-gray-400">Applying bcrypt salt rounds...</span>
             </div>
             <div className="flex gap-2">
                <span className="text-yellow-400">STATUS:</span>
                <span className="text-green-400">ENCRYPTED</span>
             </div>
             
             {/* The "Hash" Visual */}
             <div className="mt-4 p-3 bg-gray-950 rounded border border-gray-800 text-gray-500 break-all">
                <span className="text-gray-600 select-none">$2b$10$</span>
                <span className="text-green-500 animate-pulse">
                  J9.8xL5/aB2zR3kM7pQ1vW
                </span>
                <span className="text-gray-600">
                  ...8xL5/aB2zR3kM7pQ1vW
                </span>
             </div>
             
             <div className="pt-2 text-gray-500">
                &gt; Database write confirmed.<br/>
                &gt; Expiration timer set: <span className="text-red-400">ACTIVE</span>
             </div>
          </div>

          {/* Decorative Lock Icon overlay */}
          <div className="absolute -bottom-6 -right-6 text-gray-800 opacity-20">
            <Lock className="h-32 w-32" />
          </div>
        </div>

        {/* --- Policy Details --- */}
        <div className="space-y-6">
          
          {/* Feature 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Transient by Design</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                This is not cloud storage; it is a temporary cache. Once the timer hits zero, a hard-delete command is executed. Your data isn't just "hidden"—it is overwritten and removed from the physical disk.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-4">
             <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Zero-Tracking Policy</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                We do not log IP addresses, device fingerprints, or location data. There is no analytics dashboard watching you. You are a ghost in our system.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-4">
             <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Standard Encryption</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                Passwords are hashed using <strong>bcrypt</strong> with salt rounds. Content is stored securely and separated from the access logic. Without the specific link (or PIN), the data is effectively inaccessible.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ownership is Yours</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                You set the rules. You choose the custom PIN, the password, and the exact lifespan. We are simply the vessel.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}