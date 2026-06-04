import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center pt-36 pb-24 px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4">WELCOME BACK</p>
          <h1 className="text-4xl text-luxury text-primary">SIGN IN.</h1>
        </div>
        <div className="flex justify-center w-full">
          <SignIn appearance={{
            elements: {
              rootBox: "mx-auto w-full flex justify-center",
              cardBox: "mx-auto w-full flex justify-center",
              card: "mx-auto w-full bg-white rounded-none border border-primary/5 shadow-2xl p-8",
              formButtonPrimary: "bg-primary hover:bg-accent text-[10px] font-black uppercase tracking-widest transition-all duration-500 rounded-none h-12",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "rounded-none border-primary/10 hover:bg-secondary/50 transition-all",
              formFieldInput: "rounded-none border-primary/10 focus:border-accent transition-all",
              footerActionLink: "text-accent hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest",
              identityPreviewText: "text-primary font-bold",
              formFieldLabel: "text-[10px] font-black text-text-muted uppercase tracking-widest mb-2"
            }
          }} />
        </div>
      </div>
    </div>
  );
}
