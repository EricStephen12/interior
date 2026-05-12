import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4">ACCESS THE VAULT</p>
          <h1 className="text-4xl text-luxury text-primary">AUTHENTICATE.</h1>
        </div>
        <SignIn appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-accent text-[10px] font-black uppercase tracking-widest transition-all duration-500 rounded-none h-12",
            card: "bg-white rounded-none border border-primary/5 shadow-2xl p-8",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "rounded-none border-primary/10 hover:bg-secondary/50 transition-all",
            formFieldInput: "rounded-none border-primary/10 focus:border-accent transition-all",
            footerActionLink: "text-accent hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest",
            identityPreviewText: "text-primary font-bold",
            formFieldLabel: "text-[10px] font-black text-text-muted uppercase tracking-widest mb-2",
            footer: "hidden" // We'll move the footer link out to make room for our custom button
          }
        }} />

        {/* Custom KingsChat Button */}
        <div className="mt-4 px-8">
           <Link 
             href="/api/auth/kingschat"
             className="w-full h-12 bg-white border border-primary/10 flex items-center justify-center gap-3 group hover:bg-secondary/50 transition-all duration-500"
           >
             <img src="https://kingsch.at/favicon.ico" alt="" className="w-5 h-5 opacity-80 group-hover:opacity-100" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Continue with KingsChat</span>
           </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/sign-up" className="text-accent hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
