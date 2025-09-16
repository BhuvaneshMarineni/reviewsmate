import Login from "../Login";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Login />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
      </div>
    </main>
  );
}