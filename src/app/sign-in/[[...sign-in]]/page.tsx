import { SignIn } from "@clerk/nextjs";
import KingsChatButton from "@/components/KingsChatButton";

export default function Page() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center pt-32 pb-24 px-4 sm:px-6">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Luxury Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-3">
            WELCOME BACK
          </p>
          <h1 className="text-4xl sm:text-5xl text-luxury text-primary tracking-tight">
            SIGN IN.
          </h1>
        </div>

        {/* Single Seamless Card */}
        <div className="auth-card w-full bg-white rounded-3xl border border-gray-200/80 shadow-xl p-7 sm:p-8">
          {/* KingsChat Button directly on top of social buttons */}
          <div className="mb-3">
            <KingsChatButton label="Continue with KingsChat" />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
}
