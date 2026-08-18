import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Star, Info, MapPin, CheckCircle2, Trophy, TrendingUp, Award, Target } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // State for interactive FAQ accordion
    const [openFaq, setOpenFaq] = useState(0);

    // State for active price category tab ('sekolah', 'cambridge', 'utbk', 'dewasa')
    const [activeCategory, setActiveCategory] = useState('sekolah');

    // State for sticky pill navbar scroll
    const [isScrolled, setIsScrolled] = useState(false);

    // State for tutor directory & search filter
    const [tutorSubjectFilter, setTutorSubjectFilter] = useState('Semua');
    const [tutorSearch, setTutorSearch] = useState('');
    const [showAllTutors, setShowAllTutors] = useState(false);

    // State for active kegiatan tab (Dokumentasi Kelas Asli)
    const [activeKegiatan, setActiveKegiatan] = useState(0);

    // State for kegiatan image lightbox modal
    const [selectedKegiatanImg, setSelectedKegiatanImg] = useState(null);

    // State for testimoni image lightbox modal
    const [selectedTestiImg, setSelectedTestiImg] = useState(null);

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
            q: "Apakah Sina Bimbel hanya menyediakan kelas online?",
            a: "Ya. Seluruh pembelajaran di Sina Bimbel dilakukan secara online sehingga siswa dapat belajar dari mana saja dengan jadwal yang fleksibel."
        },
        {
            q: "Mata pelajaran apa saja yang tersedia?",
            a: "Kami menyediakan berbagai program Bimbel Matematika, Kimia, Fisika, Biologi, Bahasa Arab, Quran, Calistung dan Bahasa Inggris, mulai dari English for Kids, Teens, Adults, TOEFL & TOEIC, English for Business, English for Travel, hingga persiapan UTBK."
        },
        {
            q: "Apakah kelas bersifat privat?",
            a: "Ya. Semua kelas dilakukan secara privat (1 tutor 1 siswa) agar pembelajaran lebih fokus, interaktif, dan disesuaikan dengan kebutuhan masing-masing siswa."
        },
        {
            q: "Apakah saya bisa memilih jadwal belajar sendiri?",
            a: "Tentu. Jadwal belajar dapat disesuaikan dengan ketersediaan siswa dan tutor. Kami menyediakan jadwal setiap hari dari 07.00 WIB s.d 21.00 WIB."
        },
        {
            q: "Bagaimana cara mendaftar?",
            a: "Cukup hubungi admin melalui WhatsApp, lakukan konsultasi singkat, pilih paket belajar, kemudian jadwalkan kelas pertama Anda."
        },
        {
            q: "Apakah ada biaya pendaftaran?",
            a: "Ya, terdapat biaya pendaftaran Rp45.000 untuk siswa baru."
        },
        {
            q: "Apakah tersedia kelas percobaan (trial)?",
            a: "Ya, tersedia kelas trial berbayar untuk 1 sesi. Sehingga calon siswa dapat mengenal metode pembelajaran Sina Bimbel sebelum mendaftar program reguler."
        },
        {
            q: "Mengapa memilih Sina Bimbel?",
            a: "Karena kami menawarkan pembelajaran privat yang fleksibel, tutor berkualitas, materi yang disesuaikan dengan kebutuhan siswa, evaluasi perkembangan belajar, serta suasana belajar yang nyaman dan interaktif. Sesuai slogan kami: \"Dunia Digital, Belajar Maksimal.\""
        }
    ];

    const priceCategories = [
        {
            id: 'sekolah',
            tabLabel: 'Bimbel Sekolah (SD, SMP, SMA)',
            title: 'Pricelist Bimbel Private Online',
            subtitle: 'Bahasa Inggris • Matematika • IPA • IPAS • Tahsin Quran',
            badgeBg: 'bg-[#091142]',
            packages: [
                {
                    id: 'sd-smp',
                    name: 'SD & SMP',
                    badge: 'Jenjang SD & SMP',
                    badgeColor: 'bg-[#091142]',
                    price: '160.000',
                    priceFormatted: 'Rp 160.000',
                    period: '/Bulan (1 mapel)',
                    highlight: false,
                    desc: 'Bimbingan belajar 1-on-1 privat online untuk penguatan konsep dasar & pendampingan PR harian.',
                    features: [
                        '1 kali pertemuan perminggu',
                        'Total 4x pertemuan perbulan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi PR & Ujian'
                    ]
                },
                {
                    id: 'sma-sekolah',
                    name: 'SMA',
                    badge: 'Jenjang SMA',
                    badgeColor: 'bg-[#EC4899]',
                    price: '180.000',
                    priceFormatted: 'Rp 180.000',
                    period: '/Bulan (1 mapel)',
                    highlight: true,
                    desc: 'Pendampingan privat intensif untuk materi SMA demi mendongkrak nilai rapor & persiapan ujian.',
                    features: [
                        '1 kali pertemuan perminggu',
                        'Total 4x pertemuan perbulan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi PR & Ujian'
                    ]
                }
            ]
        },
        {
            id: 'cambridge',
            tabLabel: 'Kurikulum Cambridge',
            title: 'Paket Kurikulum Cambridge',
            subtitle: 'Matematika • Bahasa Inggris • Kimia • Fisika • Biologi',
            badgeBg: 'bg-[#EC4899]',
            packages: [
                {
                    id: 'cambridge-sd-smp',
                    name: 'Cambridge SD & SMP',
                    badge: 'Cambridge SD & SMP',
                    badgeColor: 'bg-[#091142]',
                    price: '260.000',
                    priceFormatted: 'Rp 260.000',
                    period: '/mapel perbulan',
                    highlight: false,
                    desc: 'Kurikulum internasional Cambridge untuk siswa SD & SMP dengan pendekatan bilingual interaktif.',
                    features: [
                        'Materi Cambridge untuk SD & SMP',
                        '1 kali pertemuan perminggu',
                        'Total 4x pertemuan perbulan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per pertemuan',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi sesuai kebutuhan'
                    ]
                },
                {
                    id: 'cambridge-sma',
                    name: 'Cambridge SMA',
                    badge: 'Pilihan Populer • Cambridge SMA',
                    badgeColor: 'bg-[#EC4899]',
                    price: '300.000',
                    priceFormatted: 'Rp 300.000',
                    period: '/mapel perbulan',
                    highlight: true,
                    desc: 'Pendampingan intensif kurikulum Cambridge SMA (IGCSE / AS & A-Level) untuk ujian internasional & olimpiade.',
                    features: [
                        'Materi Cambridge untuk SMA',
                        '1 kali pertemuan perminggu',
                        'Total 4x pertemuan perbulan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per pertemuan',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi sesuai kebutuhan'
                    ]
                }
            ]
        },
        {
            id: 'utbk',
            tabLabel: 'Paket UTBK SMA IPA',
            title: 'Paket UTBK SMA IPA',
            subtitle: 'Bahasa Inggris • Matematika • Biologi • Fisika',
            badgeBg: 'bg-[#25D366]',
            packages: [
                {
                    id: 'utbk-reguler',
                    name: 'Private UTBK Reguler',
                    badge: 'Reguler (2 Mapel)',
                    badgeColor: 'bg-[#091142]',
                    price: '500.000',
                    priceFormatted: 'Rp 500.000',
                    period: '/Bulan',
                    highlight: false,
                    desc: 'Pemantapan terarah 2 mapel pilihan dengan drilling soal & try out persiapan SNBT PTN.',
                    features: [
                        'GRATIS bank soal akses 1 tahun',
                        '2 kali pertemuan perminggu',
                        'Bisa pilih 2 mapel bimbingan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Try Out untuk Pre-test',
                        'Free akses konsultasi diluar kelas'
                    ]
                },
                {
                    id: 'utbk-intensive',
                    name: 'Private UTBK Intensive',
                    badge: 'Pilihan Populer • Intensif (3 Mapel)',
                    badgeColor: 'bg-[#25D366]',
                    price: '750.000',
                    priceFormatted: 'Rp 750.000',
                    period: '/Bulan',
                    highlight: true,
                    desc: 'Paket terlengkap 3 mapel bimbingan, 12x pertemuan, try out & bedah tuntas soal SNBT.',
                    features: [
                        'Gratis bank soal akses 1 tahun',
                        '3 kali pertemuan perminggu',
                        'Total 12x pertemuan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Try Out dan pembahasan soal',
                        'Free akses konsultasi diluar kelas',
                        'Pilih 3 mapel bimbingan'
                    ]
                }
            ]
        },
        {
            id: 'dewasa',
            tabLabel: 'Private Dewasa (English)',
            title: 'Pricelist Online Private Class - Dewasa',
            subtitle: 'Writing • Reading • Speaking • Conversation',
            badgeBg: 'bg-[#EC4899]',
            packages: [
                {
                    id: 'dewasa-beginner',
                    name: 'Beginner (pemula)',
                    badge: 'Level Pemula',
                    badgeColor: 'bg-[#25D366]',
                    price: '400.000',
                    priceFormatted: 'Rp 400.000',
                    period: '/Bulan',
                    highlight: false,
                    desc: 'Kursus bahasa Inggris privat dari dasar untuk pemula, percakapan harian & dasar grammar.',
                    features: [
                        'Materi dasar untuk pemula',
                        '2 kali pertemuan perminggu',
                        'Total 8x pertemuan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi beginner'
                    ]
                },
                {
                    id: 'dewasa-intermediate',
                    name: 'Intermediate (lanjutan)',
                    badge: 'Level Lanjutan & Karier',
                    badgeColor: 'bg-[#EC4899]',
                    price: '600.000',
                    priceFormatted: 'Rp 600.000',
                    period: '/Bulan',
                    highlight: true,
                    desc: 'Tingkatkan kefasihan speaking, persiapan TOEFL, job interview, hingga English for Specific Purposes.',
                    features: [
                        'Materi Intermediate to Advance',
                        '2 kali pertemuan perminggu',
                        'Total 8x pertemuan',
                        '1 Tutor 1 Siswa (Eksklusif)',
                        '60 menit per sesi',
                        'Pilih Jadwal sesuai waktu luang',
                        'Kelas via Google Meet',
                        'Modul & Evaluasi Berkala',
                        'Bisa request materi TOEFL, Interview, ESP.'
                    ]
                }
            ]
        }
    ];

    const tutorsData = [
        { id: 1, name: "Adee Yoan", subject: "English", uni: "UMP-UT", initial: "AY" },
        { id: 2, name: "Yasyfi Syawali Sugiawati", subject: "English", uni: "UIN Bandung", initial: "YS" },
        { id: 3, name: "Dini Agustina", subject: "Matematika", uni: "IKIP Siliwangi", initial: "DA" },
        { id: 4, name: "Nurul Fitrah", subject: "English", uni: "Universitas Lambung Mangkurat", initial: "NF" },
        { id: 5, name: "Oki Nuraeni", subject: "Matematika", uni: "Universitas Jenderal Soedirman", initial: "ON" },
        { id: 6, name: "Aliffa Anindita", subject: "English", uni: "Universitas Pakuan", initial: "AA" },
        { id: 7, name: "Raina Dione Khanna", subject: "English", uni: "Universitas Negeri Sebelas Maret", initial: "RD" },
        { id: 8, name: "Juan Agustinus Nainggolan", subject: "English", uni: "Universitas Bung Hatta", initial: "JA" },
        { id: 9, name: "Valerie Alexia Andreeyanto", subject: "English", uni: "Petra Christian University", initial: "VA" },
        { id: 10, name: "Deswinta Triani", subject: "Fisika", uni: "Universitas Bengkulu", initial: "DT" },
        { id: 11, name: "Maria Yustikaningtyas", subject: "English", uni: "Universitas Negeri Yogyakarta", initial: "MY" },
        { id: 12, name: "Marharani Kresnanti", subject: "English", uni: "Universitas Dian Nuswantoro", initial: "MK" },
        { id: 13, name: "Vanessa", subject: "English", uni: "Universitas Kristen Maranatha", initial: "V" },
        { id: 14, name: "Tabayana Rusdiyah", subject: "English", uni: "Universitas Diponegoro", initial: "TR" },
        { id: 15, name: "Deina Putri Pardanita", subject: "English", uni: "Universitas Siliwangi", initial: "DP" },
        { id: 16, name: "Desima Roida Glori Simorangkir", subject: "Fisika", uni: "Universitas Sumatera Utara", initial: "DR" },
        { id: 17, name: "Lisna Nur Farida", subject: "Tahsin", uni: "UIN Sunan Gunung Djati Bandung", initial: "LN" },
        { id: 18, name: "Ilham Sandy Pratama", subject: "English", uni: "Universitas Bandar Lampung", initial: "IS" },
        { id: 19, name: "Aulia Silvani", subject: "English", uni: "Universitas Mahakarya Asia", initial: "AS" },
        { id: 20, name: "Tazkia Al Khansa", subject: "English", uni: "Necmettin Erbakan University", initial: "TK" },
        { id: 21, name: "Alvrin Sambeani", subject: "English", uni: "Universitas Kristen Maranatha", initial: "AS" },
        { id: 22, name: "Hanief Maulana", subject: "Matematika", uni: "Universitas Negeri Malang", initial: "HM" },
        { id: 23, name: "Dea Khoerunisa", subject: "English", uni: "UPI", initial: "DK" },
        { id: 24, name: "Aliffa Anindita", subject: "English", uni: "Universitas Pakuan", initial: "AA" },
        { id: 25, name: "Siti Nadya Wulandari", subject: "English", uni: "Universitas Hasanuddin", initial: "SN" },
        { id: 26, name: "Syahla Nurul Ilmi", subject: "English", uni: "Universitas Pendidikan Indonesia", initial: "SN" },
        { id: 27, name: "Agustin Dwi Aryanti", subject: "English", uni: "Universitas Muhammadiyah Purwokerto", initial: "AD" },
        { id: 28, name: "Resti Masyita", subject: "English", uni: "Universitas Indonesia", initial: "RM" },
        { id: 29, name: "Adzkia Failasufa", subject: "Matematika", uni: "IPB University", initial: "AF" },
        { id: 30, name: "Irvi Triyani", subject: "English", uni: "Universitas Muhammadiyah Malang", initial: "IT" },
        { id: 31, name: "Putri Dwi Gustiana", subject: "English", uni: "Universitas Bengkulu", initial: "PD" },
        { id: 32, name: "Muhammad Fiqri Assidiqi SP", subject: "English", uni: "Universitas Dian Nuswantoro", initial: "MF" },
        { id: 33, name: "Dian Larasati Kartika", subject: "Kimia", uni: "Universitas Lampung", initial: "DL" },
        { id: 34, name: "Nadya Arvindiani Putri", subject: "English", uni: "IPB University", initial: "NA" },
        { id: 35, name: "Rosita Izlin", subject: "English", uni: "S1: Univ Islam Sultan Agung / PPG: Univ Galuh", initial: "RI" },
        { id: 36, name: "Assyiffah Aulia", subject: "English", uni: "Universitas Paramadina", initial: "AA" },
        { id: 37, name: "Afni Molita", subject: "Matematika", uni: "Universitas Negeri Surabaya", initial: "AM" },
        { id: 38, name: "Mutiara Lestari", subject: "English", uni: "Universitas Indraprasta PGRI", initial: "ML" },
        { id: 39, name: "Muflihatus Sururil Arifah", subject: "English", uni: "Universitas Islam Jember", initial: "MS" },
        { id: 40, name: "Annastasya Syafitri", subject: "Matematika", uni: "UIN Syarif Hidayatullah Jakarta", initial: "AS" },
        { id: 41, name: "Aldwin Zalukhu", subject: "Fisika", uni: "Universitas Jambi", initial: "AZ" },
        { id: 42, name: "Nafsah Muhtadi", subject: "English", uni: "Universitas Tadulako", initial: "NM" },
        { id: 43, name: "Risma Normalasari", subject: "Matematika", uni: "UIN Sunan Gunung Djati", initial: "RN" },
        { id: 44, name: "Rona Kamilia Q", subject: "English", uni: "Perguruan Tinggi Terkemuka", initial: "RK" },
        { id: 45, name: "Aini Salsabila", subject: "Biologi", uni: "Universitas Negeri Surabaya", initial: "AS" },
        { id: 46, name: "Agusta Jajila (Tata)", subject: "English", uni: "Universitas Kristen Artha Wacana", initial: "AJ" },
        { id: 47, name: "Herwati", subject: "English", uni: "Indraprasta PGRI", initial: "H" },
        { id: 48, name: "Nurisa Ratura Febryani", subject: "English", uni: "Albukhary International University, Malaysia", initial: "NR" },
        { id: 49, name: "Annisa Aditya", subject: "English", uni: "IAIN Bukittinggi", initial: "AA" },
        { id: 50, name: "Iska Okta Fauziah", subject: "English", uni: "Universitas Hasanuddin", initial: "IO" },
        { id: 51, name: "Irma Bahtiar", subject: "English", uni: "UPI Bandung", initial: "IB" },
        { id: 52, name: "Salma Putri Amesa", subject: "Biologi", uni: "Universitas Pendidikan Indonesia", initial: "SP" },
        { id: 53, name: "Aisyah Romadhona Amini", subject: "English", uni: "UIN Sunan Ampel Surabaya", initial: "AR" },
        { id: 54, name: "Zarira Ande Claudy K", subject: "English", uni: "Universitas Terbuka", initial: "ZA" },
        { id: 55, name: "Nabilla Dihni Amilia", subject: "Matematika", uni: "Universitas Negeri Surabaya", initial: "ND" },
        { id: 56, name: "Muhammad Agung Aprialdi", subject: "English", uni: "Universitas Djuanda", initial: "MA" },
        { id: 57, name: "Anggia Putri Salsabila Arifiani", subject: "English", uni: "Ritsumeikan Asia Pacific University", initial: "AP" },
        { id: 58, name: "Resda Fedriyanti", subject: "English", uni: "Universitas Bengkulu", initial: "RF" },
        { id: 59, name: "Rina Yuliasih", subject: "English", uni: "Universitas Indraprasta PGRI", initial: "RY" },
        { id: 60, name: "Willi Yuvikasari", subject: "English", uni: "STIE KBP Padang", initial: "WY" },
        { id: 61, name: "Harlina Ayu Mitasari", subject: "English", uni: "Universitas Swadaya Gunung Jati Cirebon", initial: "HA" }
    ];

    const subjectFilters = [
        { id: 'Semua', label: 'Semua Mapel', count: tutorsData.length },
        { id: 'English', label: 'Bahasa Inggris', count: tutorsData.filter(t => t.subject === 'English').length },
        { id: 'Matematika', label: 'Matematika', count: tutorsData.filter(t => t.subject === 'Matematika').length },
        { id: 'Fisika', label: 'Fisika', count: tutorsData.filter(t => t.subject === 'Fisika').length },
        { id: 'Biologi', label: 'Biologi', count: tutorsData.filter(t => t.subject === 'Biologi').length },
        { id: 'Kimia', label: 'Kimia', count: tutorsData.filter(t => t.subject === 'Kimia').length },
        { id: 'Tahsin', label: 'Tahsin', count: tutorsData.filter(t => t.subject === 'Tahsin').length },
    ];

    const getSubjectBadgeStyle = (subject) => {
        switch (subject) {
            case 'English':
                return 'bg-[#1e40af] text-white';
            case 'Matematika':
                return 'bg-[#25D366] text-white';
            case 'Fisika':
                return 'bg-[#EC4899] text-white';
            case 'Biologi':
                return 'bg-[#0d9488] text-white';
            case 'Kimia':
                return 'bg-[#7c3aed] text-white';
            case 'Tahsin':
                return 'bg-[#d97706] text-white';
            default:
                return 'bg-[#091142] text-white';
        }
    };

    const filteredTutors = tutorsData.filter(t => {
        const matchesSubject = tutorSubjectFilter === 'Semua' || t.subject === tutorSubjectFilter;
        const query = tutorSearch.trim().toLowerCase();
        const matchesSearch = query === '' ||
            t.name.toLowerCase().includes(query) ||
            t.uni.toLowerCase().includes(query) ||
            t.subject.toLowerCase().includes(query);
        return matchesSubject && matchesSearch;
    });

    const isFilteringOrSearching = tutorSearch.trim() !== '' || tutorSubjectFilter !== 'Semua';
    const displayedTutors = (showAllTutors || isFilteringOrSearching)
        ? filteredTutors
        : filteredTutors.slice(0, 12);

    const openWhatsAppTutor = (tutorName, tutorSubject, tutorUni) => {
        const message = `Halo Admin Sina Bimbel Private, saya tertarik untuk bimbingan privat dengan Tutor *${tutorName}* (Mapel: ${tutorSubject}, Kampus: ${tutorUni}). Mohon info ketersediaan jadwalnya.`;
        window.open(`https://wa.me/6285212373084?text=${encodeURIComponent(message)}`, '_blank');
    };

    const testimonials = [
        {
            id: 'testi-1',
            name: 'Neng Esa',
            role: 'Siswa Program Adult Pro',
            badge: 'Juara Best Paper Award',
            badgeColor: 'bg-[#091142]',
            image: '/assets/testimoni/testi-esa.jpg',
            highlight: 'Prestasi Karya Tulis & Presentasi',
            content: 'Alhamdulillah semuanya lancar, dan senang banget Esa berhasil juara Best Paper Award. Terima kasih atas doa dan bimbingannya kakk!'
        },
        {
            id: 'testi-2',
            name: 'Bunda Hans',
            role: 'Wali Murid Siswa Bimbel Online',
            badge: 'Puas & Kemajuan Signifikan',
            badgeColor: 'bg-[#25D366]',
            image: '/assets/testimoni/testi-bunda-hans.jpg',
            highlight: 'Pendampingan Tutor Sabar (Miss Yoan)',
            content: 'Jujur sy puas bgt dgn miss yoan, dan sy melihat anak sy ada kemajuan yg signifikan. Sudah saya transfer ya kak untuk lanjutan les online.'
        },
        {
            id: 'testi-3',
            name: 'Sipa',
            role: 'Siswa Bahasa Inggris',
            badge: 'Nilai Tertinggi 1 Semester',
            badgeColor: 'bg-[#EC4899]',
            image: '/assets/testimoni/testi-sipa.jpg',
            highlight: 'Bimbingan Miss Suci',
            content: 'Miss makasih yaa bimbel nyaa, sipa bisa dapat nilai tertinggi di bahasa inggris dari semester 1 sampai akhir. Pokok nya sipa bisa di titik ini karena bimbingan miss!'
        },
        {
            id: 'testi-4',
            name: 'Ulya',
            role: 'Mahasiswi (Kelas Perkuliahan & English)',
            badge: 'Nilai C Melonjak Jadi A',
            badgeColor: 'bg-[#091142]',
            image: '/assets/testimoni/testi-ulya.jpg',
            highlight: 'Materi Kuliah Terbantu (Ms Dei)',
            content: 'Sebelumnya waktu semester 1 nilai bahasa inggrisku masih C karena bener-bener gabisa... materi dari Ms tutor ngebantu banget dan alhamdulillah semester 2 ini dapat nilai A!'
        }
    ];

    const kegiatanList = [
        {
            id: 1,
            title: 'Penjelasan Interaktif dengan Pen-Tablet & Layar Digital',
            desc: 'Tutor menjelaskan rumus matematika & konsep materi langkah demi langkah langsung di layar secara real-time.',
            badge: 'Papan Tulis Digital',
            badgeColor: 'bg-[#091142]',
            bgSolid: 'bg-[#091142]',
            src: '/assets/kegiatan/kegiatan-1.jpg',
            highlight: 'Metode Visual Interaktif'
        },
        {
            id: 2,
            title: 'Sapaan Hangat & Komunikasi Dua Arah yang Ramah',
            desc: 'Suasana belajar santai namun fokus via Google Meet, membuat siswa berani bertanya tanpa rasa takut atau malu.',
            badge: 'Interaksi Hangat & Sabar',
            badgeColor: 'bg-[#25D366]',
            bgSolid: 'bg-[#25D366]',
            src: '/assets/kegiatan/kegiatan-2.jpg',
            highlight: '1 Tutor 1 Siswa Eksklusif'
        },
        {
            id: 3,
            title: 'Fokus Penuh & Pendampingan 1-on-1 Kondusif',
            desc: 'Perhatian tutor tercurah 100% pada perkembangan siswa dengan audio jernih dan materi terstruktur.',
            badge: 'Fokus Maksimal',
            badgeColor: 'bg-[#EC4899]',
            bgSolid: 'bg-[#EC4899]',
            src: '/assets/kegiatan/kegiatan-3.jpg',
            highlight: 'Jadwal 07.00 - 21.00 WIB'
        },
        {
            id: 4,
            title: 'Kupas Tuntas Soal PR, Tugas Harian & Kisi Ujian',
            desc: 'Membimbing siswa menyelesaikan soal latihan bertahap hingga tuntas dan siap menghadapi ujian sekolah.',
            badge: 'Solusi Tugas & Ujian',
            badgeColor: 'bg-[#1e40af]',
            bgSolid: 'bg-[#1e40af]',
            src: '/assets/kegiatan/kegiatan-4.jpg',
            highlight: 'Materi Sesuai Sekolah'
        }
    ];

    const currentCategory = priceCategories.find(c => c.id === activeCategory) || priceCategories[0];
    const currentKegiatan = kegiatanList[activeKegiatan] || kegiatanList[0];

    const openWhatsApp = () => {
        window.open('https://wa.me/6285212373084?text=Halo%20Sina%20Bimbel%20Private,%20saya%20ingin%20konsultasi%20pendaftaran%20program%20belajar!', '_blank');
    };

    const openWhatsAppPackage = (pkgName, catTitle) => {
        const message = `Halo Sina Bimbel Private, saya ingin mendaftar/konsultasi mengenai paket *${pkgName}* (${catTitle}).`;
        window.open(`https://wa.me/6285212373084?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <>
            <Head title="Sina Bimbel Private — Bimbingan Belajar Privat Terbaik di Cibadak, Sukabumi" />

            <div className="min-h-screen bg-white text-[#091142] font-sans overflow-x-hidden selection:bg-[#EC4899] selection:text-white">

                {/* -------------------------------------------------------------
                    NAVBAR (Silky Smooth Centered Sticky Pill Navbar)
                ------------------------------------------------------------- */}
                <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center py-3 sm:py-4">
                    <header
                        className={`pointer-events-auto transition-all duration-500 ease-in-out transform ${
                            isScrolled
                                ? 'w-[94%] max-w-5xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full px-6 sm:px-8 py-2.5 shadow-2xl shadow-blue-950/10 -translate-y-0.5'
                                : 'w-[96%] max-w-7xl bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-full px-6 sm:px-8 py-3 shadow-sm'
                        }`}
                    >
                        <div className="grid grid-cols-12 items-center">
                            
                            {/* Left: Full Transparent Logo */}
                            <div className="col-span-4 md:col-span-3 flex items-center justify-start">
                                <Link href="/" className="flex items-center group">
                                    <img
                                        src="/assets/logo-full-transparent.png"
                                        alt="Sina Bimbel Private Logo"
                                        className="h-16 sm:h-20 max-h-[76px] w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>
                            </div>

                            {/* Center: Perfectly Centered Navigation Links */}
                            <nav className="col-span-6 hidden md:flex items-center justify-center gap-7 text-sm font-bold text-[#091142]">
                                <a href="#keunggulan" className="hover:text-[#EC4899] transition-colors py-1">Keunggulan</a>
                                <a href="#kegiatan" className="hover:text-[#EC4899] transition-colors py-1">Kegiatan</a>
                                <a href="#program" className="hover:text-[#EC4899] transition-colors py-1">Program</a>
                                <a href="#tutor" className="hover:text-[#EC4899] transition-colors py-1">Tutor</a>
                                <a href="#testimoni" className="hover:text-[#EC4899] transition-colors py-1">Testimoni</a>
                                <a href="#faq" className="hover:text-[#EC4899] transition-colors py-1">FAQ</a>
                            </nav>

                            {/* Right: CTA Action Button */}
                            <div className="col-span-8 md:col-span-3 flex items-center justify-end gap-3">
                                <button
                                    onClick={openWhatsApp}
                                    className="px-5 py-2.5 rounded-full font-bold text-sm bg-[#091142] text-white hover:bg-[#25D366] transition-all shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    Daftar Sekarang
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                {/* -------------------------------------------------------------
                    1. HERO SECTION (Dedicated Full 1st Viewport Screen - Navbar & Hero Only)
                ------------------------------------------------------------- */}
                <section className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-36 lg:pt-44 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
                    
                    {/* Ambient Soft Glows */}
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#091142]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
                        
                        {/* Left Column: Text Content & CTAs */}
                        <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
                            
                            {/* Eyebrow */}
                            <p className="text-xs sm:text-sm font-extrabold text-[#EC4899] uppercase tracking-wider">
                                Sina Bimbel Private &bull; Cibadak, Sukabumi
                            </p>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#091142] leading-[1.15] tracking-tight">
                                Belajar Makin <span className="text-[#091142] underline decoration-[#EC4899] decoration-wavy decoration-2">Maksimal</span>,<br className="hidden sm:inline" />
                                Nilai Makin <span className="bg-[#EC4899] text-white px-3.5 py-1 rounded-2xl rotate-1 inline-block shadow-md">Melesat!</span>
                            </h1>

                            {/* Sub-headline */}
                            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                <strong className="text-[#091142]">Sina Bimbel Private</strong> hadir di Cibadak, Sukabumi dengan metode bimbingan privat online fleksibel, tutor berkualitas, evaluasi perkembangan belajar terukur, serta suasana belajar yang nyaman dan interaktif.
                            </p>

                            {/* CTAs */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-8 py-4 rounded-full font-extrabold text-base bg-[#EC4899] text-white hover:bg-pink-600 transition-all shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>Daftar Sekarang</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>

                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
                                >
                                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 32 32">
                                        <path d="M16 2a13.9 13.9 0 0 0-11.9 21.2L2 30l6.9-1.8A13.9 13.9 0 1 0 16 2zm0 25.4a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.4A11.5 11.5 0 1 1 16 27.4zm6.3-8.5c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.3-.7.1a9.5 9.5 0 0 1-2.8-1.7 10.5 10.5 0 0 1-1.9-2.4c-.2-.4 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.4-.6a.7.7 0 0 0 0-.6c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.6a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.7 6.7 0 0 0 1.4 3.5 15.4 15.4 0 0 0 5.9 5.2c3.5 1.5 3.5 1 4.1 1a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"/>
                                    </svg>
                                    <span>WhatsApp: 0852-1237-3084</span>
                                </button>
                            </div>

                            {/* Student Proof Bar */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-50 text-[#EC4899] flex items-center justify-center">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <div className="text-xs sm:text-sm text-slate-600 font-semibold text-left">
                                    Bergabung dengan <strong className="text-[#091142]">±220 Siswa Aktif</strong> &amp; <strong className="text-[#EC4899]">±700 Alumni</strong>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Proportional Branded Visual */}
                        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
                            <div className="relative w-72 sm:w-80 lg:w-[360px] h-72 sm:h-80 lg:h-[360px] flex items-center justify-center transition-transform duration-500 hover:scale-105 group">
                                <img
                                    src="/assets/logo-mark.png"
                                    alt="Sina Bimbel Private Logo"
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    2. STATISTIK / PROOF STRIP (Section 2 - Below the First Screen Fold)
                ------------------------------------------------------------- */}
                <section className="py-16 sm:py-20 bg-white border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            
                            {/* Stat 1: Siswa Aktif (Solid Pink) */}
                            <div className="bg-[#EC4899] text-white rounded-3xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="text-3xl sm:text-4xl font-black text-white">± 220</div>
                                <div className="text-xs sm:text-sm font-bold text-pink-100 mt-1.5">Siswa Aktif</div>
                            </div>

                            {/* Stat 2: Alumni (Solid Navy) */}
                            <div className="bg-[#091142] text-white rounded-3xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="text-3xl sm:text-4xl font-black text-white">± 700</div>
                                <div className="text-xs sm:text-sm font-bold text-blue-200 mt-1.5">Alumni Terbimbing</div>
                            </div>

                            {/* Stat 3: Berdiri Sejak (Solid WhatsApp Green) */}
                            <div className="bg-[#25D366] text-white rounded-3xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="text-3xl sm:text-4xl font-black text-white">Okt 2024</div>
                                <div className="text-xs sm:text-sm font-bold text-white/95 mt-1.5">Berdiri &amp; Berkembang</div>
                            </div>

                            {/* Stat 4: Lokasi Pusat (Solid Deep Indigo) */}
                            <div className="bg-[#1e1b4b] text-white rounded-3xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="text-2xl sm:text-3xl font-black text-white">Cibadak</div>
                                <div className="text-xs sm:text-sm font-bold text-slate-300 mt-1.5">Sukabumi (Tanpa Cabang)</div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    3. KENAPA PILIH SINA BIMBEL (Colorful Solid Bento Box)
                ------------------------------------------------------------- */}
                <section id="keunggulan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                        <p className="text-xs sm:text-sm font-extrabold text-[#EC4899] uppercase tracking-wider mb-2">
                            Keunggulan Kami
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight">
                            Kenapa Orang Tua <span className="text-[#EC4899]">Percaya</span> Sina Bimbel
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Sistem pembelajaran digital modern yang berfokus pada hasil nyata, kenyamanan siswa, serta transparansi kepada orang tua. Sesuai slogan kami: <em>"Dunia Digital, Belajar Maksimal."</em>
                        </p>
                    </div>

                    {/* Bento Grid with Solid Bold Colors & White Text */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Feature 1 (Span 7 - Solid Royal Blue) */}
                        <div className="md:col-span-7 bg-[#1e40af] text-white p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                                    100% Kelas Online Fleksibel
                                </h3>
                                <p className="text-blue-100 leading-relaxed text-base">
                                    Seluruh pembelajaran dilakukan secara online via Google Meet sehingga siswa dapat belajar dari mana saja tanpa terbatas jarak, dengan jadwal fleksibel setiap hari dari 07.00 s.d 21.00 WIB.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-blue-400/40 flex items-center gap-3 text-xs font-bold text-white flex-wrap">
                                <span className="px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-xs">Google Meet Live</span>
                                <span className="px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-xs">Jadwal 07.00 - 21.00</span>
                                <span className="px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-xs">Privat 1-on-1</span>
                            </div>
                        </div>

                        {/* Feature 2 (Span 5 - Solid Deep Navy) */}
                        <div className="md:col-span-5 bg-[#091142] text-white p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#EC4899] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01-6.824-6.479L12 14z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
                                    Tutor Berkualitas
                                </h3>
                                <p className="text-slate-200 leading-relaxed text-base">
                                    Seleksi ketat tutor lulusan perguruan tinggi ternama (UI, ITB, UGM, UNPAD) yang interaktif, komunikatif, dan sabar membimbing.
                                </p>
                            </div>
                            <div className="mt-8 font-bold text-pink-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                </svg>
                                <span>Standar Kualitas Pengajar Tinggi</span>
                            </div>
                        </div>

                        {/* Feature 3 (Span 5 - Solid Bold Pink) */}
                        <div className="md:col-span-5 bg-[#EC4899] text-white p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                                    Progress Terukur
                                </h3>
                                <p className="text-pink-100 leading-relaxed text-base">
                                    Evaluasi berkala dan modul materi disesuaikan langsung dengan kebutuhan serta tingkat pemahaman masing-masing siswa.
                                </p>
                            </div>
                            <div className="mt-8 text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30 inline-flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Evaluasi &amp; Modul Berkala</span>
                                </span>
                            </div>
                        </div>

                        {/* Feature 4 (Span 7 - Solid WhatsApp Green) */}
                        <div className="md:col-span-7 bg-[#25D366] text-white p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h10M12 3v18" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                                    Harga Terjangkau &amp; Transparan
                                </h3>
                                <p className="text-white/95 leading-relaxed text-base">
                                    Pilihan paket privat hemat mulai dari Rp 160.000 / bulan dengan biaya pendaftaran hanya Rp 45.000 untuk siswa baru, serta tersedia sesi trial.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/30 flex items-center justify-between text-xs font-bold text-white flex-wrap gap-2">
                                <span className="bg-black/10 px-3.5 py-1.5 rounded-full text-white border border-white/20">Paket Mulai Rp 160.000 / Bulan</span>
                                <span className="bg-black/10 px-3.5 py-1.5 rounded-full text-white border border-white/20">Biaya Pendaftaran Rp 45.000</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    4. DOKUMENTASI KELAS ASLI (Interactive Text with Asymmetric Visuals)
                ------------------------------------------------------------- */}
                <section id="kegiatan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                        <p className="text-xs sm:text-sm font-extrabold text-[#EC4899] uppercase tracking-wider mb-2">
                            Dokumentasi Kelas Asli
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight">
                            Suasana Belajar <span className="text-[#EC4899]">Interaktif</span> &amp; Menyenangkan
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Intip langsung keseruan sesi privat 1 tutor 1 siswa di Sina Bimbel. Pembelajaran menggunakan papan tulis digital, audio interaktif, serta bimbingan yang sabar dan fokus.
                        </p>
                    </div>

                    {/* Interactive Split Layout: Left Text Navigation, Right Asymmetric Image Frame */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
                        
                        {/* Left Column: Interactive Moment Cards (Clean, No Tags) */}
                        <div className="lg:col-span-6 space-y-4">
                            {kegiatanList.map((item, idx) => {
                                const isActive = activeKegiatan === idx;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setActiveKegiatan(idx)}
                                        className={`p-6 rounded-3xl cursor-pointer transition-all text-left ${
                                            isActive
                                                ? 'bg-[#091142] text-white shadow-2xl scale-[1.02] border-2 border-[#091142]'
                                                : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <h3 className={`text-base sm:text-lg font-extrabold ${isActive ? 'text-white' : 'text-[#091142]'}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column: Asymmetric Featured Photo + Thumbnail Strip */}
                        <div className="lg:col-span-6">
                            <div className="bg-[#091142] p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4">
                                
                                {/* Main Focal Image (Clean, No Tags) */}
                                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black group">
                                    <img
                                        src={currentKegiatan.src}
                                        alt={currentKegiatan.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#091142]/85 via-transparent to-transparent"></div>

                                    {/* Bottom Info Bar & Lightbox Trigger */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                                        <div className="text-sm sm:text-base font-extrabold line-clamp-1">{currentKegiatan.title}</div>
                                        <button
                                            onClick={() => setSelectedKegiatanImg(currentKegiatan)}
                                            className="px-3.5 py-2 rounded-xl bg-white text-[#091142] text-xs font-bold hover:bg-[#EC4899] hover:text-white transition-colors shadow-md flex items-center gap-1.5 shrink-0"
                                            title="Perbesar Foto"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                            </svg>
                                            <span>Perbesar</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Asymmetric Thumbnail Selector Strip */}
                                <div className="grid grid-cols-4 gap-2.5">
                                    {kegiatanList.map((item, idx) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveKegiatan(idx)}
                                            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                                                activeKegiatan === idx
                                                    ? 'border-[#EC4899] ring-2 ring-[#EC4899]/50 scale-105'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={item.src}
                                                alt={`Thumbnail ${item.id}`}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Section Trust Banner (Solid Navy) */}
                    <div className="mt-12 max-w-4xl mx-auto bg-[#091142] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-white/15 text-[#EC4899] flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-base font-extrabold text-white">Mau Coba Rasakan Suasana Belajar Sina Bimbel?</h4>
                                <p className="text-xs sm:text-sm text-slate-200 mt-0.5">Tersedia sesi Trial 1 Pertemuan untuk mengenal metode bimbingan privat online kami.</p>
                            </div>
                        </div>
                        <button
                            onClick={openWhatsApp}
                            className="shrink-0 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#EC4899] text-white hover:bg-pink-600 transition-all shadow-md transform hover:-translate-y-0.5"
                        >
                            Daftar Kelas Trial
                        </button>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    5. PROGRAM & PAKET BELAJAR (Clean Categories & Colored Cards)
                ------------------------------------------------------------- */}
                <section id="program" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {/* Section Header */}
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                            <p className="text-xs sm:text-sm font-extrabold text-[#EC4899] uppercase tracking-wider mb-2">
                                Pilihan Paket &amp; Biaya Resmi
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight">
                                Investasi Pendidikan <span className="text-[#EC4899]">Transparan</span>
                            </h2>
                            <p className="mt-4 text-slate-600 text-base sm:text-lg">
                                Biaya terjangkau dengan sistem bimbingan privat 1-on-1 (1 Tutor 1 Siswa) untuk SD, SMP, SMA, Cambridge, UTBK IPA, hingga kelas Dewasa.
                            </p>
                        </div>

                        {/* Clean Category Selector Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto mb-8">
                            {priceCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 sm:px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all border ${
                                        activeCategory === cat.id
                                            ? 'bg-[#091142] text-white border-[#091142] shadow-md scale-105'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
                                    }`}
                                >
                                    <span>{cat.tabLabel}</span>
                                </button>
                            ))}
                        </div>

                        {/* Active Category Header Banner */}
                        <div className="max-w-4xl mx-auto bg-[#091142] text-white rounded-2xl p-4 sm:p-5 mb-10 text-center shadow-md">
                            <div className="text-base sm:text-lg font-extrabold text-white">
                                {currentCategory.title}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-pink-200 mt-1">
                                Mata Pelajaran: <strong className="text-white">{currentCategory.subtitle}</strong>
                            </div>
                        </div>

                        {/* 2-Card Comparison Grid with Solid Bold Card Background Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {currentCategory.packages.map((pkg) => {
                                const isPopular = pkg.highlight;
                                return (
                                    <div
                                        key={pkg.id}
                                        className={`rounded-3xl p-8 sm:p-10 transition-all flex flex-col justify-between relative group ${
                                            isPopular
                                                ? 'bg-[#EC4899] text-white shadow-2xl scale-[1.02] border-2 border-pink-300'
                                                : 'bg-[#091142] text-white shadow-xl border border-slate-700'
                                        }`}
                                    >
                                        <div>
                                            {/* Top Badge & Highlight */}
                                            <div className="flex items-center justify-between gap-2 mb-6">
                                                <span className="bg-white/20 text-white font-bold text-xs px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/30">
                                                    {pkg.badge}
                                                </span>
                                                {isPopular && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#EC4899] bg-white px-3.5 py-1.5 rounded-full shadow-md">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span>Pilihan Terpopuler</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Package Title & Price */}
                                            <h3 className="text-2xl sm:text-3xl font-black text-white">
                                                {pkg.name}
                                            </h3>
                                            <p className={`text-sm mt-2 leading-relaxed ${isPopular ? 'text-pink-100' : 'text-slate-300'}`}>
                                                {pkg.desc}
                                            </p>

                                            {/* Price Box */}
                                            <div className={`mt-6 mb-6 p-5 rounded-2xl flex items-baseline justify-between ${
                                                isPopular
                                                    ? 'bg-white text-[#091142] shadow-lg'
                                                    : 'bg-white/10 text-white border border-white/15'
                                            }`}>
                                                <div>
                                                    <div className={`text-xs font-semibold ${isPopular ? 'text-slate-500' : 'text-slate-300'}`}>
                                                        Biaya Investasi:
                                                    </div>
                                                    <div className={`text-3xl sm:text-4xl font-black ${isPopular ? 'text-[#091142]' : 'text-white'}`}>
                                                        {pkg.priceFormatted}
                                                    </div>
                                                </div>
                                                <div className={`text-xs sm:text-sm font-bold ${isPopular ? 'text-slate-700' : 'text-slate-200'}`}>
                                                    {pkg.period}
                                                </div>
                                            </div>

                                            {/* Feature Checklist */}
                                            <div className="space-y-3 mb-8">
                                                <div className="font-bold text-xs uppercase tracking-wider text-white">
                                                    Fasilitas &amp; Rincian Paket:
                                                </div>
                                                <div className="space-y-2.5">
                                                    {pkg.features.map((feat, fidx) => (
                                                        <div key={fidx} className={`flex items-start gap-2.5 text-sm ${isPopular ? 'text-pink-50' : 'text-slate-200'}`}>
                                                            <svg className={`w-5 h-5 shrink-0 mt-0.5 ${isPopular ? 'text-yellow-300' : 'text-emerald-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                            </svg>
                                                            <span className="font-medium leading-snug">{feat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => openWhatsAppPackage(pkg.name, currentCategory.title)}
                                            className={`w-full py-4 rounded-full font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 ${
                                                isPopular
                                                    ? 'bg-[#091142] text-white hover:bg-black'
                                                    : 'bg-[#EC4899] text-white hover:bg-pink-600'
                                            }`}
                                        >
                                            <span>Daftar / Konsultasi Paket Ini</span>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Extra note box */}
                        <div className="mt-10 text-center text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2">
                            <Info className="w-4 h-4 text-[#091142] shrink-0" />
                            <div>
                                <strong>Informasi Tambahan:</strong> Jadwal belajar 100% fleksibel sesuai waktu luang siswa. Sistem belajar 1 Tutor 1 Siswa via Google Meet menjamin konsentrasi dan pemahaman materi maksimal.
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    6. PROFIL TUTOR (Clean Minimalist Showcase)
                ------------------------------------------------------------- */}
                <section id="tutor" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                        <p className="text-xs sm:text-sm font-extrabold text-[#16a34a] uppercase tracking-wider mb-2">
                            60+ Pengajar Pilihan
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight">
                            Tutor <span className="text-[#EC4899]">Berpengalaman</span> Dari Kampus Ternama
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Bimbingan belajar privat 1-on-1 bersama 60+ tutor lulusan perguruan tinggi unggulan di Indonesia dan mancanegara yang ramah, komunikatif, dan sabar mendampingi siswa.
                        </p>
                    </div>

                    {/* Search Bar & Interactive Filter Tabs */}
                    <div className="max-w-5xl mx-auto mb-8 space-y-4">
                        
                        {/* Live Search Input */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={tutorSearch}
                                onChange={(e) => setTutorSearch(e.target.value)}
                                placeholder="Cari tutor atau universitas (contoh: UI, IPB, English, Fisika, Matematika)..."
                                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 text-sm font-medium text-[#091142] placeholder-slate-400 shadow-2xs transition-all"
                            />
                            {tutorSearch && (
                                <button
                                    onClick={() => setTutorSearch('')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-slate-700"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>

                        {/* Subject Filter Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                            {subjectFilters.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => setTutorSubjectFilter(sub.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                        tutorSubjectFilter === sub.id
                                            ? 'bg-[#091142] text-white border-[#091142] shadow-xs scale-105'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
                                    }`}
                                >
                                    <span>{sub.label}</span>
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                                        tutorSubjectFilter === sub.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {sub.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* Result Counter & Active Filter Badge */}
                    <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between text-xs font-medium text-slate-500 px-2">
                        <div>
                            Menampilkan <strong className="text-[#091142] font-bold">{displayedTutors.length}</strong> dari <strong className="text-[#091142] font-bold">{tutorsData.length}</strong> pengajar
                            {isFilteringOrSearching && (
                                <span className="ml-2 text-[#EC4899] font-bold">
                                    (Difilter)
                                </span>
                            )}
                        </div>
                        {isFilteringOrSearching && (
                            <button
                                onClick={() => {
                                    setTutorSearch('');
                                    setTutorSubjectFilter('Semua');
                                }}
                                className="text-xs font-bold text-[#EC4899] hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {/* Empty State when search has no match */}
                    {displayedTutors.length === 0 && (
                        <div className="max-w-md mx-auto text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 p-8">
                            <div className="w-16 h-16 rounded-full bg-pink-100 text-[#EC4899] flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[#091142]">Tidak Ada Tutor Ditemukan</h3>
                            <p className="text-slate-500 text-xs mt-1">Coba gunakan kata kunci lain seperti "English", "Matematika", atau nama kampus.</p>
                            <button
                                onClick={() => {
                                    setTutorSearch('');
                                    setTutorSubjectFilter('Semua');
                                }}
                                className="mt-4 px-5 py-2 rounded-full text-xs font-bold bg-[#091142] text-white hover:bg-[#25D366] transition-all"
                            >
                                Tampilkan Semua Tutor
                            </button>
                        </div>
                    )}

                    {/* Clean Minimalist Tutor Directory (Focused on Tutor Name, University, & Focus Subject) */}
                    {displayedTutors.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
                            {displayedTutors.map((tut) => {
                                const badgeClass = getSubjectBadgeStyle(tut.subject);
                                return (
                                    <div
                                        key={tut.id}
                                        onClick={() => openWhatsAppTutor(tut.name, tut.subject, tut.uni)}
                                        className="bg-white hover:bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
                                    >
                                        <div>
                                            {/* Top Row: Focus Subject Badge (Solid Background) */}
                                            <div className="mb-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs ${badgeClass}`}>
                                                    {tut.subject}
                                                </span>
                                            </div>

                                            {/* Tutor Name */}
                                            <h3 className="text-base font-extrabold text-[#091142] group-hover:text-[#EC4899] transition-colors leading-snug">
                                                {tut.name}
                                            </h3>

                                            {/* Lulusan / Asal Universitas */}
                                            <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
                                                {tut.uni || 'Perguruan Tinggi Terkemuka'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Expand / Collapse Button (When not searching/filtering) */}
                    {!isFilteringOrSearching && (
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => setShowAllTutors(!showAllTutors)}
                                className="px-8 py-3 rounded-full font-extrabold text-xs sm:text-sm bg-[#091142] text-white hover:bg-[#25D366] transition-all shadow-md inline-flex items-center gap-2 transform hover:-translate-y-0.5"
                            >
                                <span>{showAllTutors ? 'Tampilkan Lebih Sedikit' : `Lihat Seluruh ${tutorsData.length} Tutor Lengkap`}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${showAllTutors ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="text-xs text-slate-500 mt-2 font-medium">
                                {showAllTutors
                                    ? `Menampilkan seluruh ${tutorsData.length} tutor Sina Bimbel Private`
                                    : `Menampilkan 12 tutor pilihan — Klik untuk melihat seluruh ${tutorsData.length} tutor`}
                            </div>
                        </div>
                    )}

                </section>

                {/* -------------------------------------------------------------
                    7. TESTIMONI SISWA & ORANG TUA (Bukti Asli Chat WhatsApp)
                ------------------------------------------------------------- */}
                <section id="testimoni" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                            <p className="text-xs sm:text-sm font-extrabold text-[#16a34a] uppercase tracking-wider mb-2">
                                Bukti Kepuasan &amp; Chat Asli
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight">
                                Cerita <span className="text-[#EC4899]">Sukses</span> Siswa &amp; Orang Tua
                            </h2>
                            <p className="mt-4 text-slate-600 text-base sm:text-lg">
                                Tangkapan layar percakapan asli langsung dari WhatsApp mengenai kepuasan belajar, kenaikan nilai sekolah &amp; kuliah, hingga raihan prestasi juara kompetisi bersama Sina Bimbel.
                            </p>
                        </div>

                        {/* 4 Clean WhatsApp Screenshot Images Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {testimonials.map((testi) => (
                                <div
                                    key={testi.id}
                                    onClick={() => setSelectedTestiImg(testi)}
                                    className="group relative bg-[#091142] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 border border-slate-200"
                                >
                                    <div className="aspect-[3/4] w-full overflow-hidden">
                                        <img
                                            src={testi.image}
                                            alt={`Testimoni ${testi.name}`}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Hover Zoom Overlay */}
                                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <span className="px-4 py-2 rounded-full bg-white text-[#091142] text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                                            <span>Lihat Bukti Chat</span>
                                            <svg className="w-3.5 h-3.5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Social Proof Bar */}
                        <div className="mt-12 text-center bg-pink-50/60 border border-pink-100 rounded-3xl p-6 max-w-3xl mx-auto shadow-2xs">
                            <div className="text-sm font-bold text-[#091142]">
                                Bergabunglah bersama <span className="text-[#EC4899]">±220 Siswa Aktif</span> &amp; <span className="text-[#16a34a]">±700 Alumni</span> yang telah membuktikan hasil belajar maksimal di Sina Bimbel Private!
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    8. FAQ (Interactive Collapsible Accordion)
                ------------------------------------------------------------- */}
                <section id="faq" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Side Title */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Eyebrow (Clean Text, No Pill, No Dot) */}
                            <p className="text-xs sm:text-sm font-extrabold text-[#091142] uppercase tracking-wider mb-2">
                                FAQ Center
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#091142] tracking-tight leading-tight">
                                Pertanyaan Yang Sering <span className="text-[#EC4899]">Ditanyakan</span>
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed">
                                Punya pertanyaan seputar Sina Bimbel? Kami telah merangkum jawaban atas pertanyaan yang paling sering ditanyakan oleh calon siswa dan orang tua.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="px-6 py-3 rounded-full font-bold text-sm bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-md inline-flex items-center gap-2"
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
                                    className={`rounded-2xl border transition-all overflow-hidden ${
                                        openFaq === idx
                                            ? 'bg-blue-50/50 border-[#091142]/30 shadow-md'
                                            : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 shadow-sm'
                                    }`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-extrabold text-[#091142] text-base sm:text-lg hover:text-[#EC4899] transition-colors"
                                    >
                                        <span>Q: {faq.q}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-transform ${
                                            openFaq === idx ? 'bg-[#091142] text-white rotate-180' : 'bg-blue-100 text-[#091142]'
                                        }`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    {openFaq === idx && (
                                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-blue-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    9. CTA PENUTUP (Clean Solid Container, No Avatar Placeholders)
                ------------------------------------------------------------- */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-white">
                    <div className="bg-[#091142] text-white rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
                        
                        {/* Overlapping Pink Circles Decoration */}
                        <div className="absolute -top-16 -left-16 w-48 h-48 border-8 border-[#EC4899] rounded-full opacity-20 pointer-events-none"></div>
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 border-8 border-[#EC4899] rounded-full opacity-20 pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            {/* Eyebrow (Clean Text with Icon) */}
                            <p className="text-xs sm:text-sm font-extrabold text-pink-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <MapPin className="w-4 h-4 text-pink-300 shrink-0" />
                                <span>Cibadak, Sukabumi &bull; Sejak Oktober 2024</span>
                            </p>

                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                Siap Bantu Anak <span className="text-[#EC4899] underline decoration-white decoration-wavy">Belajar Maksimal</span>?
                            </h2>

                            <p className="text-slate-200 text-base sm:text-lg font-medium">
                                Gabung bersama <strong className="text-white">±220 siswa aktif</strong> &amp; <strong className="text-white">±700 alumni</strong> yang sudah merasakan nyamannya bimbingan privat terarah di Sina Bimbel Private.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full font-extrabold text-base bg-[#EC4899] text-white hover:bg-pink-600 transition-all shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <span>Konsultasi Gratis via WhatsApp</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* -------------------------------------------------------------
                    10. FOOTER & KONTAK (Single Solid BG Color, No Pink Border, Same Navbar Logo)
                ------------------------------------------------------------- */}
                <footer className="bg-[#091142] text-white pt-16 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                            
                            {/* Col 1: Brand Info & Socials (Span 4) */}
                            <div className="md:col-span-4 space-y-4">
                                <Link href="/" className="inline-block">
                                    <img
                                        src="/assets/logo-full-light.png"
                                        alt="Sina Bimbel Private Logo"
                                        className="h-16 sm:h-20 w-auto object-contain"
                                    />
                                </Link>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                                    <strong className="text-white">Sina Bimbel Private</strong> — Lembaga bimbingan belajar privat terpercaya di Cibadak, Sukabumi (Pusat Tunggal, tanpa cabang). Berdiri sejak Oktober 2024 untuk mencetak generasi berprestasi untuk jenjang SD, SMP, SMA, Cambridge, UTBK, dan kelas Dewasa.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    {/* Instagram */}
                                    <a
                                        href="https://www.instagram.com/bimbelprivatsina?igsh=MXRxeDFqc2dqbmxiZg=="
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#EC4899] hover:text-white transition-colors"
                                        title="Instagram @bimbelprivatsina"
                                    >
                                        <svg className="w-5 h-5 fill-none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a6 6 0 016-6h6a6 6 0 016 6v6a6 6 0 01-6 6H9a6 6 0 01-6-6V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 7.5h.01" />
                                        </svg>
                                    </a>

                                    {/* TikTok */}
                                    <a
                                        href="https://www.tiktok.com/@sina.bimbel.priva?_r=1&_t=ZS-98bBgosIjFi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#EC4899] hover:text-white transition-colors"
                                        title="TikTok @sina.bimbel.priva"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                        </svg>
                                    </a>

                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/6285212373084"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#25D366] hover:text-white transition-colors"
                                        title="WhatsApp 0852-1237-3084"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 32 32">
                                            <path d="M16 2a13.9 13.9 0 0 0-11.9 21.2L2 30l6.9-1.8A13.9 13.9 0 1 0 16 2zm0 25.4a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.4A11.5 11.5 0 1 1 16 27.4zm6.3-8.5c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.3-.7.1a9.5 9.5 0 0 1-2.8-1.7 10.5 10.5 0 0 1-1.9-2.4c-.2-.4 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.4-.6a.7.7 0 0 0 0-.6c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.6a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.7 6.7 0 0 0 1.4 3.5 15.4 15.4 0 0 0 5.9 5.2c3.5 1.5 3.5 1 4.1 1a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Col 2: Program Navigation (Span 3) */}
                            <div className="md:col-span-3 space-y-3">
                                <h3 className="text-sm font-bold text-[#EC4899] uppercase tracking-wider">Navigasi Program</h3>
                                <ul className="space-y-2.5 text-sm text-slate-300">
                                    <li><a href="#program" className="hover:text-white transition-colors">Bimbel Private SD &amp; SMP</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Bimbel Private SMA</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Kurikulum Cambridge</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Paket UTBK SMA IPA</a></li>
                                    <li><a href="#program" className="hover:text-white transition-colors">Private Class Dewasa English</a></li>
                                </ul>
                            </div>

                            {/* Col 3: Quick Links (Span 2) */}
                            <div className="md:col-span-2 space-y-3">
                                <h3 className="text-sm font-bold text-[#EC4899] uppercase tracking-wider">Eksplorasi Sina</h3>
                                <ul className="space-y-2.5 text-sm text-slate-300">
                                    <li><a href="#keunggulan" className="hover:text-white transition-colors">Keunggulan Kami</a></li>
                                    <li><a href="#kegiatan" className="hover:text-white transition-colors">Dokumentasi Kelas</a></li>
                                    <li><a href="#tutor" className="hover:text-white transition-colors">Direktori 60+ Tutor</a></li>
                                    <li><a href="#testimoni" className="hover:text-white transition-colors">Testimoni &amp; Bukti</a></li>
                                    <li><a href="#faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</a></li>
                                </ul>
                            </div>

                            {/* Col 4: Contact Details (Span 3) */}
                            <div className="md:col-span-3 space-y-3">
                                <h3 className="text-sm font-bold text-[#EC4899] uppercase tracking-wider">Informasi Kontak</h3>
                                <div className="space-y-2.5 text-sm text-slate-300">
                                    <div className="flex items-start gap-2.5">
                                        <svg className="w-5 h-5 text-[#EC4899] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Cibadak, Sukabumi, Jawa Barat (Pusat Tunggal)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <a href="https://wa.me/6285212373084" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                            0852-1237-3084
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-[#EC4899] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Setiap Hari: 07.00 - 21.00 WIB</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <svg className="w-5 h-5 text-[#EC4899] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <a href="mailto:bimbelponatan@gmail.com" className="hover:text-white transition-colors">
                                            bimbelponatan@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Bottom Copyright */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                            <div>
                                &copy; {new Date().getFullYear()} Sina Bimbel Private. All rights reserved.
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
                        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 transform active:scale-95 border-2 border-white/40"
                        title="Hubungi WhatsApp Sina Bimbel Private (0852-1237-3084)"
                        aria-label="Hubungi WhatsApp Sina Bimbel Private"
                    >
                        {/* Pulsing Ring */}
                        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none"></span>

                        {/* Official Crisp WhatsApp SVG Logo */}
                        <svg className="w-8 h-8 fill-current relative z-10" viewBox="0 0 32 32">
                            <path d="M16 2a13.9 13.9 0 0 0-11.9 21.2L2 30l6.9-1.8A13.9 13.9 0 1 0 16 2zm0 25.4a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.3 1.1 1.1-4.2-.3-.4A11.5 11.5 0 1 1 16 27.4zm6.3-8.5c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.3-.7.1a9.5 9.5 0 0 1-2.8-1.7 10.5 10.5 0 0 1-1.9-2.4c-.2-.4 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.4-.6a.7.7 0 0 0 0-.6c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.6a1.3 1.3 0 0 0-.9.4 3.9 3.9 0 0 0-1.2 2.9 6.7 6.7 0 0 0 1.4 3.5 15.4 15.4 0 0 0 5.9 5.2c3.5 1.5 3.5 1 4.1 1a3.5 3.5 0 0 0 2.3-1.6 2.9 2.9 0 0 0 .2-1.6c-.1-.2-.3-.3-.7-.5z"/>
                        </svg>

                        {/* Tooltip */}
                        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#091142] text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700">
                            Chat WA: 0852-1237-3084
                        </span>
                    </button>
                </div>

                {/* -------------------------------------------------------------
                    LIGHTBOX PREVIEW MODAL (Dokumentasi Belajar)
                ------------------------------------------------------------- */}
                {selectedKegiatanImg && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
                        onClick={() => setSelectedKegiatanImg(null)}
                    >
                        <div 
                            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedKegiatanImg(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg"
                                aria-label="Tutup"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Modal Image */}
                            <div className="relative max-h-[60vh] sm:max-h-[65vh] bg-[#091142] flex items-center justify-center overflow-hidden">
                                <img
                                    src={selectedKegiatanImg.src}
                                    alt={selectedKegiatanImg.title}
                                    className="w-full h-full max-h-[60vh] sm:max-h-[65vh] object-contain"
                                />
                                <span className={`absolute top-4 left-4 ${selectedKegiatanImg.badgeColor} text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}>
                                    {selectedKegiatanImg.badge}
                                </span>
                            </div>

                            {/* Modal Caption & Action */}
                            <div className="p-6 sm:p-8 bg-white">
                                <div className="text-xs font-extrabold uppercase tracking-wider text-[#EC4899] mb-1">
                                    {selectedKegiatanImg.highlight}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-[#091142] leading-snug">
                                    {selectedKegiatanImg.title}
                                </h3>
                                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                    {selectedKegiatanImg.desc}
                                </p>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                                        <span>Sina Bimbel Private • Cibadak, Sukabumi</span>
                                    </div>
                                    <button
                                         onClick={() => {
                                             setSelectedKegiatanImg(null);
                                             openWhatsApp();
                                         }}
                                         className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-md flex items-center justify-center gap-2"
                                     >
                                         <span>Tanya / Daftar Kelas</span>
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                         </svg>
                                     </button>
                                 </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* -------------------------------------------------------------
                    LIGHTBOX PREVIEW MODAL (Bukti Testimoni Chat WA)
                ------------------------------------------------------------- */}
                {selectedTestiImg && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
                        onClick={() => setSelectedTestiImg(null)}
                    >
                        <div 
                            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedTestiImg(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg"
                                aria-label="Tutup"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Modal Image Frame */}
                            <div className="relative flex-1 bg-[#0b141a] flex items-center justify-center overflow-auto p-3">
                                <img
                                    src={selectedTestiImg.image}
                                    alt={`Bukti Chat ${selectedTestiImg.name}`}
                                    className="w-full max-h-[62vh] object-contain rounded-xl shadow-inner"
                                />
                                <span className={`absolute top-4 left-4 ${selectedTestiImg.badgeColor} text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}>
                                    {selectedTestiImg.badge}
                                </span>
                            </div>

                            {/* Modal Caption & Action */}
                            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                                <div className="mb-2">
                                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#EC4899]">
                                        {selectedTestiImg.highlight}
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#091142]">
                                        {selectedTestiImg.name} &bull; <span className="text-xs text-slate-500 font-semibold">{selectedTestiImg.role}</span>
                                    </h3>
                                </div>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic line-clamp-2">
                                    "{selectedTestiImg.content}"
                                </p>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span>Tangkapan Layar Asli WhatsApp</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedTestiImg(null);
                                            openWhatsApp();
                                        }}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>Konsultasi Belajar</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
