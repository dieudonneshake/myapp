import { ImpactFlowForm } from '@/components/impact-flow-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary tracking-tight">CODE FOR IMPACT COMPETITION</h1>
          <p className="mt-2 text-lg text-muted-foreground">Submit your project for consideration.</p>
        </header>
        <ImpactFlowForm />
      </div>
    </main>
  );
}
