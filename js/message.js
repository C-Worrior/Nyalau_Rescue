// 1. THE MESSAGE SEQUENCER
function playSequenceMessage(arrayMsg, index = 0){
    if (index >= arrayMsg.length) {
        return; 
    }
    const currentMsg = arrayMsg[index].texts;
    const nextCallback = function() {
        playSequenceMessage(arrayMsg, index + 1);
    };
    showModal(currentMsg.title, currentMsg.msg, currentMsg.btnText, nextCallback);
}

// 2. TUTORIAL DATA
const tutoMsg_1 = [
    {
        texts : {
            title: "Misi Anda",
            msg: "Kem Nyalau memerlukan bekalan kecemasan. Anda perlu memprogramkan robot untuk menghantar bekalan ke Kem Nyalau.",
            btnText: "Seterusnya"
        }
    },
    {
        texts : {
            title: "Blok Langkah",
            msg: "Pertama, gunakan blok 'Langkah' untuk menggerakkan robot ke hadapan. Kemudian, gunakan 'Turunkan bekalan' di kem untuk melepasi tahap ini.",
            btnText: "Faham"
        }
    }
];

const tutoMsg_2 = [
    {
        texts : {
            title: "Blok Pusing",
            msg: "Gunakan blok 'Pusing' untuk memutarkan robot sebelum melangkah. Pilih 90 darjah untuk pusing ke kanan, atau -90 darjah untuk pusing ke kiri.",
            btnText: "Faham!"
        }
    }
];

const tutoMsg_3 = [
    {
        texts : {
            title: "Jambatan Runtuh",
            msg: "Alamak! Banjir telah menghanyutkan sebahagian laluan di sektor ini. Jika robot masuk ke dalam air, litar pintas akan berlaku.",
            btnText: "Seterusnya"
        }
    },
    {
        texts : {
            title: "Blok Lompat",
            msg: "Gunakan blok 'Lompat halangan' baharu untuk melompat ke hadapan tepat dua petak! Ini membolehkan anda terbang dengan selamat melepasi air.",
            btnText: "Mari Terbang!"
        }
    }
];

const tutoMsg_4 = [
    {
        texts : {
            title: "Blok Ulang",
            msg: "Menulis arahan yang sama berulang kali amat memenatkan! Gunakan 'Blok Ulang' untuk mengulangi kod di dalamnya. Cuba gunakannya untuk berjalan di laluan lurus ini dengan lebih pantas.",
            btnText: "Mari Cuba!"
        }
    }
];

// 3. LEVEL ENTRY TRIGGERS
const levelMessages = [
    {
        texts : {
            title: "BANTUAN KECEMASAN", 
            msg: "Nyalau dalam Bahaya! Banjir telah melanda Nyalau dan semua Kem Kecemasan kekurangan bekalan.", 
            btnText: "Seterusnya", 
            onClose: function() { playSequenceMessage(tutoMsg_1); }
        }
    },
    {
        texts : {
            title: "Menavigasi Selekoh",
            msg: "Laluan ke stesen mangsa seterusnya bukanlah garis lurus. Jika anda hanya menggunakan blok Langkah, robot akan terus masuk ke dalam air banjir!",
            btnText: "Seterusnya",
            onClose: function() { playSequenceMessage(tutoMsg_2); }
        }
    },
    {
        texts : {
            title: "Sektor 3",
            msg: "Pengimbas menunjukkan bahaya air yang besar di hadapan. Pergerakan biasa adalah mustahil.",
            btnText: "Seterusnya",
            onClose: function() { playSequenceMessage(tutoMsg_3); }
        }
    },

    {
        texts : {
            title: "Jalan Jauh",
            msg: "Laluan ini sangat lurus, tetapi panjang. Terdapat cara yang lebih bijak untuk memprogram robot ini tanpa menghabiskan semua blok anda.",
            btnText: "Seterusnya",
            onClose: function() { playSequenceMessage(tutoMsg_4); }
        }
    }
];

// 4. GAME EVENT MESSAGES
const eventMessages = {
    drown: {
        title: "Sistem Gagal!",
        msg: "SPLASH! Robot telah masuk ke dalam air banjir dan mengalami litar pintas. Kita perlu memulakan semula sistem.",
        btnText: "Mula Semula Robot"
    },
    crash: {
        title: "Perlanggaran Dikesan!",
        msg: "BUMP! Robot terlanggar serpihan pepejal. Semak kod anda dan pastikan laluan jelas sebelum bergerak.",
        btnText: "Semak Laluan"
    },
    wrongDrop: {
        title: "Zon Gugur Salah",
        msg: "Anda menggugurkan bekalan di sektor yang salah! Mangsa berada di tapak kem yang ditetapkan.",
        btnText: "Ambil Semula Bekalan"
    },
    levelClear: {
        title: "Bekalan Dihantar!",
        msg: "Kerja yang bagus! Mangsa di stesen ini telah menerima bekalan kecemasan. Bersedia untuk sektor seterusnya?",
        btnText: "Sektor Seterusnya"
    },
    gameWin: {
        title: "Misi Selesai!",
        msg: "TAHNIAH! Anda berjaya menavigasi semua sektor banjir dan menyelamatkan semua mangsa di Kem Nyalau. Kemahiran pengaturcaraan anda telah menyelamatkan keadaan!"
    }
};

let n = 1
function showMessage(level = n){
    showModal(levelMessages[level-1].texts.title, levelMessages[level-1].texts.msg, levelMessages[level-1].texts.btnText, levelMessages[level-1].texts.onClose)
    n++;
}