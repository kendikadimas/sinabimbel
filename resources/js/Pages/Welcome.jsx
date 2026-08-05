import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // State for interactive FAQ accordion
    const [openFaq, setOpenFaq] = useState(0);

    // State for active program filter tab
    const [activeProgramTab, setActiveProgramTab] = useState('smp');

    // State for sticky pill navbar scroll
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const faqs = [
        {
            q: "Apakah bisa trial kelas dulu sebelum daftar?",
            a: "Tentu saja! Sina Bimbel menyediakan 1x Sesi Trial Class Gratis agar siswa dan orang tua dapat merasakan langsung metode pembelajaran interaktif serta kecocokan dengan tutor kami sebelum mendaftar."
        },
        {
            q: "Sistem belajarnya online, offline, atau keduanya?",
            a: "Kami menyediakan sistem belajar Hybrid yang sangat fleksibel. Siswa dapat memilih kelas Online via Zoom/Google Meet dengan digital whiteboard, kelas Offline kelompok di cabang Sina Bimbel, atau Kelas Privat datang ke rumah."
        },
        {
            q: "Apakah ada laporan progress ke orang tua?",
            a: "Ya, transparansi adalah prioritas kami. Orang tua akan menerima Rapor Evaluasi Belajar Bulanan yang mencakup tingkat pemahaman materi, grafik presensi, keaktifan, dan catatan tutor pendamping."
        },
        {
            q: "Bagaimana cara pendaftarannya?",
            a: "Pendaftaran sangat cepat & mudah! Anda cukup menekan tombol 'Daftar Sekarang' atau 'Konsultasi Gratis' untuk terhubung langsung dengan Customer Education Advisor kami via WhatsApp."
        }
    ];

    const programs = [
        {
            id: 'sd',
            category: 'Bimbel SD',
            badgeBg: 'bg-[#FF4FA3]',
            title: 'Penguatan Fondasi SD (Kelas 1 - 6)',
            desc: 'Fokus pada penguatan konsep dasar Matematika, Bahasa Indonesia, IPA, serta bimbingan membaca, menulis, dan berhitung (Calistung).',
            meetings: '8 - 12 Pertemuan / bulan',
            price: 'Rp 350.000',
            period: '/bulan',
            features: [
                'Bahan ajar bergambar & interaktif',
                'Pendampingan PR sekolah harian',
                'Kuis latihan mingguan',
                'Maksimal 6 siswa per kelas'
            ],
            recommended: false
        },
        {
            id: 'smp',
            category: 'Bimbel SMP',
            badgeBg: 'bg-[#7B3FE4]',
            title: 'Persiapan Prestasi & Ujian SMP',
            desc: 'Bimbingan mendalam untuk Matematika, IPA (Fisika, Biologi, Kimia), Bahasa Inggris, dan persiapan Ujian Akhir Sekolah.',
            meetings: '12 Pertemuan / bulan',
            price: 'Rp 450.000',
            period: '/bulan',
            features: [
                'Trik cepat soal Rumus Praktis',
                'Bank Soal latihan terbaru',
                'Try Out semester berkala',
                'Konsultasi tugas sekolah 24/7'
            ],
            recommended: true
        },
        {
            id: 'sma',
            category: 'Bimbel SMA & UTBK',
            badgeBg: 'bg-[#E8453C]',
            title: 'Intensif SMA & SNBT / UTBK PTN',
            desc: 'Strategi pemantapan materi SMA dan drilling soal TPS (Tes Potensi Skolastik), Literasi, & Penalaran Matematika untuk masuk PTN Favorit.',
            meetings: '16 Pertemuan / bulan',
            price: 'Rp 550.000',
            period: '/bulan',
            features: [
                'Modul Drilling UTBK Terupdate',
                'Simulasi Try Out Sistem IRT Real-time',
                'Konsultasi Strategi Jurusan PTN',
                'Analisis Rasio Kelulusan SNBT'
            ],
            recommended: false
        },
        {
            id: 'privat',
            category: 'Kelas Privat',
            badgeBg: 'bg-[#2E9E4F]',
            title: 'Privat 1-on-1 Eksklusif',
            desc: 'Pendampingan 1 tutor untuk 1 siswa dengan kurikulum dan jadwal yang 100% disesuaikan dengan target serta kecepatan belajar anak.',
            meetings: 'Jadwal Fleksibel',
            price: 'Custom',
            period: 'sesuai paket',
            features: [
                'Pilih tutor favorit sesuai domisili',
                'Bisa request materi spesifik',
                'Pilihan Online atau Tatap Muka Home Visit',
                'Garansi ganti tutor jika kurang cocok'
            ],
            recommended: false
        }
    ];

    const tutors = [
        {
            name: 'Dr. Amanda Putri, M.Pd.',
            role: 'Spesialis Matematika & Fisika',
            uni: 'Alumni Universitas Indonesia (UI)',
            exp: '8+ Tahun Mengajar',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Bagas Prasetyo, S.Si.',
            role: 'Spesialis Kimia & Biologi',
            uni: 'Alumni Institut Teknologi Bandung (ITB)',
            exp: '6+ Tahun Mengajar',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Citra Lestari, S.Pd.',
            role: 'Spesialis Bahasa Inggris & UTBK',
            uni: 'Alumni Universitas Gadjah Mada (UGM)',
            exp: '5+ Tahun Mengajar',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: 'Dimas Ramadhan, M.Sc.',
            role: 'Spesialis TPS & Penalaran Matematika',
            uni: 'Alumni Universitas Padjadjaran (UNPAD)',
            exp: '7+ Tahun Mengajar',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        }
    ];

    const testimonials = [
        {
            name: 'Ibu Rina Anggraini',
            role: 'Orang Tua dari Kenzo (Siswa SMP)',
            badge: 'Nilai Naik 65 → 92',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
            content: 'Sina Bimbel bener-bener membantu anak saya yang tadinya malas belajar Matematika jadi semangat banget! Nilai ujian sekolahnya naik dari 65 jadi 92. Tutornya sabar banget dan pelaporannya transparan.'
        },
        {
            name: 'Bagas Pratama',
            role: 'Siswa SMA & UTBK (Lolos UI)',
            badge: 'Lolos Teknik Industri UI',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
            content: 'Bimbingan intensif UTBK SNBT di Sina Bimbel ngebantu banget paham konsep TPS & Penalaran Matematika. Latihan try out IRT real-time nya bikin saya terbiasa sama tipe soal asli hingga lolos PTN Impian!'
        },
        {
            name: 'Ibu Hendra Wijaya',
            role: 'Orang Tua dari Nayla (Siswa SD)',
            badge: 'Progress Belajar Terpantau',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
            content: 'Fitur laporan progress bulanan sangat membantu kami sebagai orang tua pekerja untuk terus memantau perkembangan belajar Calistung dan Matematika anak kami. Tutornya ramah dan datang tepat waktu.'
        }
    ];

    const activeProgram = programs.find(p => p.id === activeProgramTab) || programs[1];

    const openWhatsApp = () => {
        window.open('https://wa.me/6281234567890?text=Halo%20Sina%20Bimbel,%20saya%20ingin%20konsultasi%20pendaftaran%20program%20belajar!', '_blank');
    };

    return (
        <>
            <Head title="Sina Bimbel — Dunia Digital, Belajar Maksimal" />

            <div className="min-h-screen bg-white text-[#1F1F2E] font-sans overflow-x-hidden selection:bg-[#7B3FE4] selection:text-white">

                {/* -------------------------------------------------------------
                    NAVBAR (Silky Smooth Centered Sticky Pill Navbar)
                ------------------------------------------------------------- */}
                <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center py-3 sm:py-4">
                    <header
                        className={`pointer-events-auto transition-all duration-500 ease-in-out transform ${
                            isScrolled
                                ? 'w-[94%] max-w-5xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full px-6 sm:px-8 py-2.5 shadow-2xl shadow-purple-900/10 -translate-y-0.5'
                                : 'w-[96%] max-w-7xl bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-full px-6 sm:px-8 py-3 shadow-sm'
                        }`}
                    >
                        <div className="grid grid-cols-12 items-center">
                            
                            {/* Left: Full Transparent Logo (100% Bigger) */}
                            <div className="col-span-4 md:col-span-3 flex items-center justify-start">
                                <Link href="/" className="flex items-center group">
                                    <img
                                        src="/assets/logo-full-transparent.png"
                                        alt="Sina Bimbel Logo"
                                        className="h-16 sm:h-20 max-h-[76px] w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>
                            </div>

                            {/* Center: Perfectly Centered Navigation Links */}
                            <nav className="col-span-6 hidden md:flex items-center justify-center gap-8 text-sm font-bold text-[#1B3A6B]">
                                <a href="#keunggulan" className="hover:text-[#7B3FE4] transition-colors py-1">Keunggulan</a>
                                <a href="#program" className="hover:text-[#7B3FE4] transition-colors py-1">Program</a>
                                <a href="#tutor" className="hover:text-[#7B3FE4] transition-colors py-1">Tutor</a>
                                <a href="#testimoni" className="hover:text-[#7B3FE4] transition-colors py-1">Testimoni</a>
                                <a href="#faq" className="hover:text-[#7B3FE4] transition-colors py-1">FAQ</a>
                            </nav>

                            {/* Right: CTA Action Button */}
                            <div className="col-span-8 md:col-span-3 flex items-center justify-end gap-3">
                                <button
                                    onClick={openWhatsApp}
                                    className="px-5 py-2.5 rounded-full font-bold text-sm bg-[#FFC93C] text-[#1B3A6B] hover:bg-yellow-300 transition-all shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    Daftar Sekarang
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                {/* -------------------------------------------------------------
                    1. HERO SECTION (Clean 2-Column: Left Text, Right Image)
                ------------------------------------------------------------- */}
                <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Ambient Soft Glows */}
                    <div className="absolute top-10 left-10 w-96 h-96 bg-[#7B3FE4]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#FFC93C]/15 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                        
                        {/* Left Column: Text Content & CTAs */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs sm:text-sm font-bold text-[#7B3FE4] shadow-sm">
                                <svg className="w-4 h-4 text-[#FF4FA3]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
                                </svg>
                                <span>Bimbel Digital Terpercaya</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B3A6B] leading-tight tracking-tight">
                                Belajar Makin <span className="text-[#7B3FE4] underline decoration-[#FFC93C] decoration-wavy decoration-2">Maksimal</span>,<br className="hidden sm:inline" />
                                Nilai Makin <span className="bg-[#FF4FA3] text-white px-3 py-1 rounded-2xl rotate-1 inline-block shadow-md">Melesat!</span>
                            </h1>

                            {/* Sub-headline */}
                            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Sina Bimbel hadir dengan sistem belajar digital yang fleksibel — belajar kapan saja, dari mana saja, dengan tutor berpengalaman yang siap dampingi progress belajar anak.
                            </p>

                            {/* CTAs */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-8 py-4 rounded-full font-extrabold text-base bg-[#FFC93C] text-[#1B3A6B] hover:bg-yellow-300 transition-all shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>Daftar Sekarang</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>

                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-[#25D366] hover:bg-emerald-600 text-white transition-all shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
                                >
                                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 32 32">
                                        <path d="M16 2a13.9 13.9 0 0 0-11.9 21.2L2 30l6.9-1.8A13.9 13.9 0 1 0 16 2zm0 25.4a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.4A11.5 11.5 0 1 1 16 27.4zm6.3-8.5c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.3-.7.1a9.5 9.5 0 0 1-2.8-1.7 10.5 10.5 0 0 1-1.9-2.4c-.2-.4 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.4-.6a.7.7 0 0 0 0-.6c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.6a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.7 6.7 0 0 0 1.4 3.5 15.4 15.4 0 0 0 5.9 5.2c3.5 1.5 3.5 1 4.1 1a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"/>
                                    </svg>
                                    <span>Hubungi via WhatsApp</span>
                                </button>
                            </div>

                            {/* Student Proof Bar */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-4">
                                <div className="flex -space-x-3">
                                    <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Student" />
                                    <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Student" />
                                    <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Student" />
                                </div>
                                <div className="text-xs sm:text-sm text-slate-600 font-semibold text-left">
                                    Bergabung dengan <strong className="text-[#1B3A6B]">500+ Siswa Aktif</strong> di seluruh Indonesia
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Hero Image Frame */}
                        <div className="lg:col-span-5">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-[#1B3A6B]">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                                    alt="Siswa Belajar Digital Sina Bimbel"
                                    className="w-full h-[420px] sm:h-[480px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A6B]/70 via-transparent to-transparent"></div>

                                {/* Floating Metric Badge */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#2E9E4F]/15 text-[#2E9E4F] flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-medium">Tingkat Kelulusan</div>
                                            <div className="text-sm font-extrabold text-[#1B3A6B]">95%+ Tembus PTN / Sekolah Favorit</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    2. STATISTIK / PROOF STRIP (Positioned Immediately After Hero)
                ------------------------------------------------------------- */}
                <section className="py-10 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            
                            {/* Stat 1 */}
                            <div className="py-2">
                                <div className="text-3xl sm:text-4xl font-black text-[#7B3FE4]">500+</div>
                                <div className="text-xs sm:text-sm font-bold text-[#1B3A6B] mt-1">Siswa Aktif</div>
                            </div>

                            {/* Stat 2 */}
                            <div className="py-2">
                                <div className="text-3xl sm:text-4xl font-black text-[#1B3A6B]">5+ Tahun</div>
                                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Pengalaman Mengajar</div>
                            </div>

                            {/* Stat 3 */}
                            <div className="py-2">
                                <div className="text-3xl sm:text-4xl font-black text-[#2E9E4F]">98%</div>
                                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Kepuasan Orang Tua</div>
                            </div>

                            {/* Stat 4 */}
                            <div className="py-2">
                                <div className="text-3xl sm:text-4xl font-black text-[#FF4FA3]">150+</div>
                                <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Alumni PTN Favorit</div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    3. KENAPA PILIH SINA BIMBEL (Asymmetric Feature Bento)
                ------------------------------------------------------------- */}
                <section id="keunggulan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#7B3FE4]/10 text-[#7B3FE4] font-bold text-xs uppercase tracking-wider mb-3">
                            Keunggulan Kami
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B3A6B] tracking-tight">
                            Kenapa Orang Tua <span className="text-[#7B3FE4]">Percaya</span> Sina Bimbel
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Sistem pembelajaran digital modern yang berfokus pada hasil nyata, kenyamanan siswa, serta transparansi kepada orang tua.
                        </p>
                    </div>

                    {/* Asymmetric Bento Grid Position */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Feature 1 (Span 7 - Large Highlight) */}
                        <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-[#7B3FE4]/10 text-[#7B3FE4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1B3A6B] mb-3 group-hover:text-[#7B3FE4] transition-colors">
                                    Belajar Fleksibel (Online, Offline &amp; Hybrid)
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base">
                                    Siswa bebas memilih moda pembelajaran yang sesuai dengan ritme belajar dan aktivitas sehari-hari tanpa membebani siswa.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-[#7B3FE4]">
                                <span className="px-3 py-1 rounded-full bg-purple-50">Online Zoom</span>
                                <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700">Offline Kelompok</span>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">Privat 1-on-1</span>
                            </div>
                        </div>

                        {/* Feature 2 (Span 5 - Accent Box) */}
                        <div className="md:col-span-5 bg-gradient-to-br from-[#7B3FE4] to-purple-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#FFC93C] flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01-6.824-6.479L12 14z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white">
                                    Tutor Berpengalaman
                                </h3>
                                <p className="text-purple-100 leading-relaxed text-base">
                                    Seleksi ketat tutor lulusan perguruan tinggi ternama (UI, ITB, UGM, UNPAD) yang interaktif dan komunikatif.
                                </p>
                            </div>
                            <div className="mt-8 font-bold text-yellow-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                </svg>
                                <span>Standar Kualitas Pengajar Tinggi</span>
                            </div>
                        </div>

                        {/* Feature 3 (Span 5) */}
                        <div className="md:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-[#FF4FA3]/10 text-[#FF4FA3] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1B3A6B] mb-3 group-hover:text-[#7B3FE4] transition-colors">
                                    Progress Terukur
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base">
                                    Rapor evaluasi bulanan dan grafik pemahaman materi dikirimkan rutin kepada orang tua secara transparan.
                                </p>
                            </div>
                            <div className="mt-8 text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <svg className="w-4 h-4 text-[#2E9E4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Laporan Rapor Rutin Setiap Bulan</span>
                            </div>
                        </div>

                        {/* Feature 4 (Span 7) */}
                        <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-[#2E9E4F]/10 text-[#2E9E4F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h10M12 3v18" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1B3A6B] mb-3 group-hover:text-[#7B3FE4] transition-colors">
                                    Harga Terjangkau &amp; Transparan
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base">
                                    Pilihan investasi pendidikan yang ramah keluarga dengan opsi pembayaran fleksibel tanpa biaya tersembunyi.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E9E4F]">
                                <span>Paket Mulai Rp 350.000 / Bulan</span>
                                <span>Tanpa Biaya Registrasi Tersembunyi</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    4. PROGRAM & PAKET BELAJAR (Interactive Split Showcase)
                ------------------------------------------------------------- */}
                <section id="program" className="py-20 bg-slate-50/70 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            
                            {/* Left Sticky Selector Column */}
                            <div className="lg:col-span-5 space-y-6">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFC93C]/30 text-[#1B3A6B] font-bold text-xs uppercase tracking-wider">
                                    Pilihan Program
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B3A6B] tracking-tight">
                                    Pilih <span className="text-[#7B3FE4]">Program</span> Belajar
                                </h2>
                                <p className="text-slate-600 text-base leading-relaxed">
                                    Klik salah satu kategori di bawah untuk melihat rincian kurikulum, frekuensi pertemuan, serta fitur bimbingan.
                                </p>

                                {/* Vertical Interactive Navigation Tabs */}
                                <div className="space-y-3 pt-2">
                                    {programs.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setActiveProgramTab(p.id)}
                                            className={`w-full text-left p-4 rounded-2xl font-bold transition-all flex items-center justify-between border ${
                                                activeProgramTab === p.id
                                                    ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-md'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${p.badgeBg}`}></span>
                                                <span>{p.category}</span>
                                            </div>
                                            <span className="text-xs opacity-75">{p.meetings}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Selected Program Showcase Card */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
                                    
                                    {/* Recommended Pill with SVG Icon */}
                                    {activeProgram.recommended && (
                                        <div className="inline-flex items-center gap-1.5 bg-[#7B3FE4] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-sm">
                                            <svg className="w-3.5 h-3.5 text-[#FFC93C]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.416.646-.784 1.34-1.282 1.944-.69.837-1.572 1.574-2.316 2.378-1.543 1.666-2.906 3.655-2.906 5.922 0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-2.825-1.564-5.32-3.724-6.666-.889-.554-1.89-1.026-2.5-1.633z" clipRule="evenodd"/>
                                            </svg>
                                            <span>Pilihan Paling Populer</span>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                        <div>
                                            <span className={`${activeProgram.badgeBg} text-white font-bold text-xs px-3 py-1 rounded-full`}>
                                                {activeProgram.category}
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B3A6B] mt-2">
                                                {activeProgram.title}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-[#7B3FE4]">{activeProgram.price}</div>
                                            <div className="text-xs text-slate-500 font-medium">{activeProgram.period}</div>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-base leading-relaxed mb-8 border-b border-slate-100 pb-6">
                                        {activeProgram.desc}
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <div className="font-bold text-[#1B3A6B] text-sm uppercase tracking-wider">Fasilitas Bimbingan:</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                                            {activeProgram.features.map((feat, fidx) => (
                                                <div key={fidx} className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <svg className="w-5 h-5 text-[#2E9E4F] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                    </svg>
                                                    <span className="font-medium">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={openWhatsApp}
                                        className="w-full py-4 rounded-full font-extrabold text-base bg-[#FFC93C] text-[#1B3A6B] hover:bg-yellow-300 transition-all shadow-md flex items-center justify-center gap-3"
                                    >
                                        <span>Konsultasi &amp; Daftar Program Ini</span>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    5. PROFIL TUTOR (Meet Our Instructors Style)
                ------------------------------------------------------------- */}
                <section id="tutor" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4FA3]/10 text-[#FF4FA3] font-bold text-xs uppercase tracking-wider mb-3">
                            Tutor Terbaik
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B3A6B] tracking-tight">
                            <span className="text-[#7B3FE4]">Tutor</span> Berpengalaman &amp; Terpercaya
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Tutor kami adalah lulusan terbaik dari perguruan tinggi favorit dan berpengalaman mengajar, siap membimbing siswa dengan pendekatan interaktif yang mudah dipahami.
                        </p>
                    </div>

                    {/* 4 Columns Tutor Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tutors.map((tut, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group">
                                <div className="relative mx-auto w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-[#FFC93C] transition-colors bg-purple-100 flex items-center justify-center">
                                    <img
                                        src={tut.avatar}
                                        alt={tut.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
                                        }}
                                    />
                                </div>

                                <h3 className="text-lg font-bold text-[#1B3A6B] group-hover:text-[#7B3FE4] transition-colors">
                                    {tut.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#FF4FA3] mt-1 mb-2">
                                    {tut.role}
                                </p>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium mb-3">
                                    <svg className="w-3.5 h-3.5 text-[#7B3FE4]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                    </svg>
                                    <span>{tut.uni}</span>
                                </div>

                                <div className="text-xs text-gray-500 font-semibold border-t border-slate-100 pt-3 flex items-center justify-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-[#FFC93C]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span>{tut.exp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    6. TESTIMONI SISWA & ORANG TUA (3-Card Grid Layout)
                ------------------------------------------------------------- */}
                <section id="testimoni" className="py-20 bg-slate-50/70 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2E9E4F]/10 text-[#2E9E4F] font-bold text-xs uppercase tracking-wider mb-3">
                                Proof In Every Story
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B3A6B] tracking-tight">
                                Cerita <span className="text-[#FF4FA3]">Sukses</span> Dari Siswa Kami
                            </h2>
                            <p className="mt-4 text-slate-600 text-base sm:text-lg">
                                Pendapat jujur orang tua dan siswa yang telah merasakan langsung peningkatan prestasi dan percaya diri bersama Sina Bimbel.
                            </p>
                        </div>

                        {/* 3 Columns Testimonials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testi, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 flex flex-col justify-between transition-all relative group">
                                    <div>
                                        {/* Rating Stars */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-1 text-[#FFC93C]">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-[#7B3FE4]">
                                                {testi.badge}
                                            </span>
                                        </div>

                                        <p className="text-slate-700 text-base leading-relaxed italic mb-8">
                                            "{testi.content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                                        <img
                                            src={testi.avatar}
                                            alt={testi.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-[#7B3FE4]"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80';
                                            }}
                                        />
                                        <div>
                                            <div className="font-extrabold text-[#1B3A6B] text-sm">{testi.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{testi.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    7. FAQ (Interactive Collapsible Accordion)
                ------------------------------------------------------------- */}
                <section id="faq" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Side Title */}
                        <div className="lg:col-span-5 space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#7B3FE4]/10 text-[#7B3FE4] font-bold text-xs uppercase tracking-wider">
                                FAQ Center
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1B3A6B] tracking-tight leading-tight">
                                Pertanyaan Yang Sering <span className="text-[#7B3FE4]">Ditanyakan</span>
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed">
                                Punya pertanyaan seputar Sina Bimbel? Kami telah merangkum jawaban atas pertanyaan yang paling sering ditanyakan oleh calon siswa dan orang tua.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="px-6 py-3 rounded-full font-bold text-sm bg-[#7B3FE4] text-white hover:bg-purple-700 transition-all shadow-md inline-flex items-center gap-2"
                                >
                                    <span>Tanya Tim Kami via WA</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right Side Accordions */}
                        <div className="lg:col-span-7 space-y-4">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-extrabold text-[#1B3A6B] text-base sm:text-lg hover:text-[#7B3FE4] transition-colors"
                                    >
                                        <span>Q: {faq.q}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-transform ${
                                            openFaq === idx ? 'bg-[#7B3FE4] text-white rotate-180' : 'bg-purple-50 text-[#7B3FE4]'
                                        }`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    {openFaq === idx && (
                                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    8. CTA PENUTUP (Clean Floating Card Container)
                ------------------------------------------------------------- */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="bg-[#FFC93C] rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-xl">
                        
                        {/* Overlapping Purple Circles Decoration */}
                        <div className="absolute -top-16 -left-16 w-48 h-48 border-8 border-[#7B3FE4] rounded-full opacity-20 pointer-events-none"></div>
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 border-8 border-[#7B3FE4] rounded-full opacity-20 pointer-events-none"></div>

                        {/* Floating Small Student Avatars */}
                        <img className="hidden sm:block absolute top-10 left-12 w-14 h-14 rounded-full border-2 border-white object-cover shadow-lg transform -rotate-6" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Student" />
                        <img className="hidden sm:block absolute top-12 right-16 w-14 h-14 rounded-full border-2 border-white object-cover shadow-lg transform rotate-12" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Student" />
                        <img className="hidden sm:block absolute bottom-10 left-20 w-14 h-14 rounded-full border-2 border-white object-cover shadow-lg transform rotate-6" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Student" />
                        <img className="hidden sm:block absolute bottom-12 right-24 w-14 h-14 rounded-full border-2 border-white object-cover shadow-lg transform -rotate-12" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Student" />

                        {/* Content */}
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <span className="inline-block px-4 py-1 rounded-full bg-white text-[#1B3A6B] font-bold text-xs uppercase tracking-wider shadow-sm">
                                Bimbel Digital Terpercaya
                            </span>

                            <h2 className="text-3xl sm:text-5xl font-black text-[#1B3A6B] tracking-tight leading-tight">
                                Siap Bantu Anak <span className="text-[#7B3FE4] underline decoration-white decoration-wavy">Belajar Maksimal</span>?
                            </h2>

                            <p className="text-[#1B3A6B]/80 text-base sm:text-lg font-medium">
                                Gabung bersama ratusan siswa yang sudah rasakan bedanya belajar lebih menyenangkan &amp; berprestasi di Sina Bimbel.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full font-extrabold text-base bg-[#7B3FE4] text-white hover:bg-purple-800 transition-all shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>Daftar Sekarang / Hubungi via WA</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    FOOTER & KONTAK (Full Transparent Logo)
                ------------------------------------------------------------- */}
                <footer className="bg-[#1B3A6B] text-white pt-16 pb-12 border-t-4 border-[#FFC93C]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-blue-900/60">
                            
                            {/* Col 1: Brand Info */}
                            <div className="md:col-span-5 space-y-4">
                                <div className="inline-block bg-white p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-100">
                                    <img src="/assets/logo-full-transparent.png" alt="Sina Bimbel Logo Full" className="h-16 sm:h-20 w-auto object-contain" />
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                                    Sina Bimbel — Dunia Digital, Belajar Maksimal. Platform bimbingan belajar terpercaya dengan metode interaktif untuk jenjang SD, SMP, SMA, dan persiapan UTBK SNBT.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FFC93C] hover:text-[#1B3A6B] transition-colors" title="Website">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FFC93C] hover:text-[#1B3A6B] transition-colors" title="Instagram">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a6 6 0 016-6h6a6 6 0 016 6v6a6 6 0 01-6 6H9a6 6 0 01-6-6V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 7.5h.01" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FFC93C] hover:text-[#1B3A6B] transition-colors" title="YouTube">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Col 2: Program Navigation */}
                            <div className="md:col-span-3 space-y-3">
                                <h3 className="text-base font-bold text-[#FFC93C] uppercase tracking-wider">Program Belajar</h3>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li><a href="#program" className="hover:text-white transition-colors">Bimbel SD (Calistung &amp; Mapel)</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Bimbel SMP (Ujian &amp; Prestasi)</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Bimbel SMA &amp; Intensif UTBK</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Kelas Privat 1-on-1 Custom</a></li>
                                </ul>
                            </div>

                            {/* Col 3: Contact Details */}
                            <div className="md:col-span-4 space-y-3">
                                <h3 className="text-base font-bold text-[#FFC93C] uppercase tracking-wider">Informasi Kontak</h3>
                                <div className="space-y-2.5 text-sm text-slate-300">
                                    <div className="flex items-start gap-2.5">
                                        <svg className="w-5 h-5 text-[#FFC93C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Jl. Pendidikan Digital No. 88, Jakarta Selatan</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-[#2E9E4F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>WhatsApp: +62 812-3456-7890</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-[#FFC93C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Senin - Sabtu: 08.00 - 20.00 WIB</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-[#FF4FA3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>info@sinabimbel.com</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Bottom Copyright */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                            <div>
                                &copy; {new Date().getFullYear()} Sina Bimbel. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:underline">Kebijakan Privasi</a>
                                <a href="#" className="hover:underline">Syarat &amp; Ketentuan</a>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* -------------------------------------------------------------
                    FIXED FLOATING BOTTOM-RIGHT WHATSAPP BUTTON
                ------------------------------------------------------------- */}
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={openWhatsApp}
                        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 transition-all duration-300 transform active:scale-95"
                        title="Hubungi via WhatsApp"
                        aria-label="Hubungi via WhatsApp"
                    >
                        {/* Pulsing Ring */}
                        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none"></span>

                        {/* Official Crisp WhatsApp SVG Logo */}
                        <svg className="w-8 h-8 fill-current relative z-10" viewBox="0 0 32 32">
                            <path d="M16 2a13.9 13.9 0 0 0-11.9 21.2L2 30l6.9-1.8A13.9 13.9 0 1 0 16 2zm0 25.4a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.4A11.5 11.5 0 1 1 16 27.4zm6.3-8.5c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.3-.7.1a9.5 9.5 0 0 1-2.8-1.7 10.5 10.5 0 0 1-1.9-2.4c-.2-.4 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.4-.6a.7.7 0 0 0 0-.6c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.6a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.7 6.7 0 0 0 1.4 3.5 15.4 15.4 0 0 0 5.9 5.2c3.5 1.5 3.5 1 4.1 1a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"/>
                        </svg>

                        {/* Tooltip */}
                        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700">
                            Chat WhatsApp
                        </span>
                    </button>
                </div>

            </div>
        </>
    );
}
