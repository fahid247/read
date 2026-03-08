import Image from 'next/image';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements - Pure Tailwind */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_ease-in-out_infinite_2s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[blob_7s_ease-in-out_infinite_4s]"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl w-full">
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image with Enhanced Effects */}
            <div className="relative order-2 lg:order-1">
              {/* Glow Rings */}
              <div className="absolute inset-0 bg-linear-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Image Container with Floating Animation */}
              <div className="relative w-72 h-72 mx-auto lg:w-96 lg:h-96 animate-[float_6s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-linear-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-20 animate-ping"></div>
                <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-700">
                  <Image
                    src="/Screenshot 2025-12-21 165357.png"
                    alt="403 Forbidden - Access Denied"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Decorative Badges */}
              <div className="absolute -top-4 -right-4 lg:right-12 flex gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded-full border border-red-500/30 backdrop-blur-sm">
                  ⚡ SECURE ZONE
                </span>
              </div>
              <div className="absolute -bottom-4 -left-4 lg:left-12">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded-full border border-blue-500/30 backdrop-blur-sm">
                  🔒 RESTRICTED
                </span>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="text-center lg:text-left space-y-8 order-1 lg:order-2">
              {/* Status Code with Glitch Effect */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-red-400 font-mono text-sm font-semibold tracking-wider">ERROR 403 • ACCESS DENIED</span>
                </div>
                
                <h1 className="text-8xl lg:text-9xl font-black">
                  <span className="bg-linear-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_3s_linear_infinite]">
                    403
                  </span>
                </h1>
              </div>

              {/* Title with Animation */}
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  Access <span className="text-red-500 relative">
                    Forbidden
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 5" preserveAspectRatio="none">
                      <line x1="0" y1="2.5" x2="100" y2="2.5" stroke="currentColor" strokeWidth="3" className="text-red-500/30" strokeDasharray="4 4"/>
                    </svg>
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0">
                  You don&apos;t have permission to access this page. 
                  This area is restricted to authorized personnel only.
                </p>
              </div>

              {/* Security Tips Card */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">Quick Solutions:</h3>
                    <ul className="space-y-2">
                      {[
                        'Verify you\'re logged in with correct credentials',
                        'Check with administrator for access permissions',
                        'Clear browser cache and cookies',
                        'Try accessing from corporate network'
                      ].map((tip, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-400 text-sm">
                          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25 inline-flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="relative z-10">Return Home</span>
                </Link>
                
                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700 hover:border-slate-600 inline-flex items-center justify-center gap-3 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Support</span>
                </Link>
              </div>

              {/* Quick Action Links */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-sm">
                <Link href="/login" className="text-slate-500 hover:text-red-400 transition-colors group flex items-center gap-1">
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="/dashboard" className="text-slate-500 hover:text-red-400 transition-colors group flex items-center gap-1">
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <span className="text-slate-700">•</span>
                <Link href="/help" className="text-slate-500 hover:text-red-400 transition-colors group flex items-center gap-1">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-slate-700">Privacy Policy</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-700">Terms of Service</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-700">Security</span>
          </div>
        </div>
      </div>

      {/* Add custom animations to your global CSS or use style tag */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}