import MemeGenerator from "@/components/MemeGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-xl text-secondary">Generate meme with ease</p>
        <h1 className="text-5xl lg:text-7xl font-bold text-accent uppercase">Meme generator</h1>
        <div className="mt-10 p-4">
          <MemeGenerator />
        </div>
      </div>
    </main>
  );
}
