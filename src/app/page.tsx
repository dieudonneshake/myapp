
import { ImpactFlowForm } from '@/components/impact-flow-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary tracking-tight">CODE FOR IMPACT COMPETITION</h1>
          <p className="mt-2 text-lg text-muted-foreground">Submit your project for consideration.</p>
        </header>

        <div className="mb-8 p-6 rounded-lg bg-card border border-border shadow-sm">
          <h2 className="font-headline text-2xl font-bold text-primary mb-4">🌍 Code for Impact Competition – Application Portal</h2>
          <p className="mb-4 text-card-foreground">
            Welcome to the official application portal for the Code for Impact Competition, an initiative proudly organized by Mastery Hub of Rwanda in collaboration with ALX, the One Million Rwandan Coders Initiative.
          </p>
          <p className="mb-4 text-card-foreground">
            This competition aims to empower Rwandan youth, fresh graduates, innovators, and change-makers to design and build impact-driven tech solutions that respond to the real challenges faced in Rwanda and beyond. Whether you are tackling problems in education, health, agriculture, governance, AI, business, communication, or transport, we believe in your potential to bring positive change through innovation.
          </p>
          <p className="mb-4 text-card-foreground">
            We are seeking original, scalable, and socially impactful projects that go beyond ideas — solutions that can transform lives, strengthen systems, and make Rwanda shine on the global technology map.
          </p>
          <p className="font-semibold text-accent mb-4">🧠 Got a brilliant idea or a working project? This is your moment to make it count.</p>
          <p className="mb-4 text-card-foreground">
            Fill out the form below carefully. Provide accurate information, upload your concept note, and ensure you’ve read the Terms and Conditions before submitting.
          </p>
          <p className="font-headline font-bold text-lg text-center text-primary">
            Together, let’s code for a better future.
            <br/>
            Let big dreams begin!
          </p>
        </div>

        <ImpactFlowForm />
      </div>
    </main>
  );
}
