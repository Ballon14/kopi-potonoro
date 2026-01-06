import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('province');
  const apiKey = process.env.RAJAONGKIR_API_KEY;

  if (!provinceId) {
    return NextResponse.json({ success: false, error: 'Province ID required' }, { status: 400 });
  }

  // Mock Data if no API Key
  if (!apiKey) {
    const mockCities = [
      // Bali (province_id: 1)
      { city_id: "17", province_id: "1", type: "Kabupaten", city_name: "Badung", postal_code: "80351" },
      { city_id: "32", province_id: "1", type: "Kabupaten", city_name: "Bangli", postal_code: "80619" },
      { city_id: "94", province_id: "1", type: "Kabupaten", city_name: "Buleleng", postal_code: "81111" },
      { city_id: "114", province_id: "1", type: "Kota", city_name: "Denpasar", postal_code: "80227" },
      { city_id: "128", province_id: "1", type: "Kabupaten", city_name: "Gianyar", postal_code: "80519" },
      { city_id: "161", province_id: "1", type: "Kabupaten", city_name: "Jembrana", postal_code: "82251" },
      { city_id: "170", province_id: "1", type: "Kabupaten", city_name: "Karangasem", postal_code: "80819" },
      { city_id: "197", province_id: "1", type: "Kabupaten", city_name: "Klungkung", postal_code: "80711" },
      { city_id: "447", province_id: "1", type: "Kabupaten", city_name: "Tabanan", postal_code: "82119" },

      // Bangka Belitung (province_id: 2)
      { city_id: "27", province_id: "2", type: "Kabupaten", city_name: "Bangka", postal_code: "33212" },
      { city_id: "28", province_id: "2", type: "Kabupaten", city_name: "Bangka Barat", postal_code: "33315" },
      { city_id: "29", province_id: "2", type: "Kabupaten", city_name: "Bangka Selatan", postal_code: "33719" },
      { city_id: "30", province_id: "2", type: "Kabupaten", city_name: "Bangka Tengah", postal_code: "33613" },
      { city_id: "56", province_id: "2", type: "Kabupaten", city_name: "Belitung", postal_code: "33419" },
      { city_id: "57", province_id: "2", type: "Kabupaten", city_name: "Belitung Timur", postal_code: "33519" },
      { city_id: "334", province_id: "2", type: "Kota", city_name: "Pangkal Pinang", postal_code: "33115" },

      // Banten (province_id: 3)
      { city_id: "106", province_id: "3", type: "Kota", city_name: "Cilegon", postal_code: "42417" },
      { city_id: "232", province_id: "3", type: "Kabupaten", city_name: "Lebak", postal_code: "42319" },
      { city_id: "331", province_id: "3", type: "Kabupaten", city_name: "Pandeglang", postal_code: "42212" },
      { city_id: "402", province_id: "3", type: "Kabupaten", city_name: "Serang", postal_code: "42182" },
      { city_id: "403", province_id: "3", type: "Kota", city_name: "Serang", postal_code: "42111" },
      { city_id: "455", province_id: "3", type: "Kabupaten", city_name: "Tangerang", postal_code: "15914" },
      { city_id: "456", province_id: "3", type: "Kota", city_name: "Tangerang", postal_code: "15111" },
      { city_id: "457", province_id: "3", type: "Kota", city_name: "Tangerang Selatan", postal_code: "15332" },

      // Bengkulu (province_id: 4)
      { city_id: "62", province_id: "4", type: "Kabupaten", city_name: "Bengkulu Selatan", postal_code: "38519" },
      { city_id: "63", province_id: "4", type: "Kabupaten", city_name: "Bengkulu Tengah", postal_code: "38319" },
      { city_id: "64", province_id: "4", type: "Kabupaten", city_name: "Bengkulu Utara", postal_code: "38619" },
      { city_id: "65", province_id: "4", type: "Kota", city_name: "Bengkulu", postal_code: "38229" },
      { city_id: "175", province_id: "4", type: "Kabupaten", city_name: "Kaur", postal_code: "38911" },
      { city_id: "183", province_id: "4", type: "Kabupaten", city_name: "Kepahiang", postal_code: "39319" },
      { city_id: "233", province_id: "4", type: "Kabupaten", city_name: "Lebong", postal_code: "39119" },
      { city_id: "294", province_id: "4", type: "Kabupaten", city_name: "Muko Muko", postal_code: "38715" },
      { city_id: "379", province_id: "4", type: "Kabupaten", city_name: "Rejang Lebong", postal_code: "39112" },
      { city_id: "397", province_id: "4", type: "Kabupaten", city_name: "Seluma", postal_code: "38811" },

      // DI Yogyakarta (province_id: 5)
      { city_id: "39", province_id: "5", type: "Kabupaten", city_name: "Bantul", postal_code: "55715" },
      { city_id: "135", province_id: "5", type: "Kabupaten", city_name: "Gunung Kidul", postal_code: "55812" },
      { city_id: "210", province_id: "5", type: "Kabupaten", city_name: "Kulon Progo", postal_code: "55611" },
      { city_id: "419", province_id: "5", type: "Kabupaten", city_name: "Sleman", postal_code: "55513" },
      { city_id: "501", province_id: "5", type: "Kota", city_name: "Yogyakarta", postal_code: "55122" },

      // DKI Jakarta (province_id: 6)
      { city_id: "151", province_id: "6", type: "Kota", city_name: "Jakarta Barat", postal_code: "11220" },
      { city_id: "152", province_id: "6", type: "Kota", city_name: "Jakarta Pusat", postal_code: "10540" },
      { city_id: "153", province_id: "6", type: "Kota", city_name: "Jakarta Selatan", postal_code: "12230" },
      { city_id: "154", province_id: "6", type: "Kota", city_name: "Jakarta Timur", postal_code: "13330" },
      { city_id: "155", province_id: "6", type: "Kota", city_name: "Jakarta Utara", postal_code: "14140" },
      { city_id: "189", province_id: "6", type: "Kabupaten", city_name: "Kepulauan Seribu", postal_code: "14550" },

      // Gorontalo (province_id: 7)
      { city_id: "77", province_id: "7", type: "Kabupaten", city_name: "Bone Bolango", postal_code: "96511" },
      { city_id: "129", province_id: "7", type: "Kabupaten", city_name: "Gorontalo", postal_code: "96218" },
      { city_id: "130", province_id: "7", type: "Kota", city_name: "Gorontalo", postal_code: "96115" },
      { city_id: "131", province_id: "7", type: "Kabupaten", city_name: "Gorontalo Utara", postal_code: "96611" },
      { city_id: "361", province_id: "7", type: "Kabupaten", city_name: "Pohuwato", postal_code: "96419" },

      // Jambi (province_id: 8)
      { city_id: "50", province_id: "8", type: "Kabupaten", city_name: "Batang Hari", postal_code: "36613" },
      { city_id: "97", province_id: "8", type: "Kabupaten", city_name: "Bungo", postal_code: "37211" },
      { city_id: "156", province_id: "8", type: "Kota", city_name: "Jambi", postal_code: "36137" },
      { city_id: "194", province_id: "8", type: "Kabupaten", city_name: "Kerinci", postal_code: "37167" },
      { city_id: "280", province_id: "8", type: "Kabupaten", city_name: "Merangin", postal_code: "37319" },
      { city_id: "293", province_id: "8", type: "Kabupaten", city_name: "Muaro Jambi", postal_code: "36311" },
      { city_id: "393", province_id: "8", type: "Kabupaten", city_name: "Sarolangun", postal_code: "37419" },
      { city_id: "442", province_id: "8", type: "Kabupaten", city_name: "Sungaipenuh", postal_code: "37113" },
      { city_id: "460", province_id: "8", type: "Kabupaten", city_name: "Tanjung Jabung Barat", postal_code: "36513" },
      { city_id: "461", province_id: "8", type: "Kabupaten", city_name: "Tanjung Jabung Timur", postal_code: "36719" },
      { city_id: "471", province_id: "8", type: "Kabupaten", city_name: "Tebo", postal_code: "37519" },

      // Jawa Barat (province_id: 9)
      { city_id: "22", province_id: "9", type: "Kota", city_name: "Bandung", postal_code: "40111" },
      { city_id: "23", province_id: "9", type: "Kabupaten", city_name: "Bandung", postal_code: "40311" },
      { city_id: "24", province_id: "9", type: "Kabupaten", city_name: "Bandung Barat", postal_code: "40552" },
      { city_id: "34", province_id: "9", type: "Kota", city_name: "Banjar", postal_code: "46311" },
      { city_id: "54", province_id: "9", type: "Kabupaten", city_name: "Bekasi", postal_code: "17837" },
      { city_id: "55", province_id: "9", type: "Kota", city_name: "Bekasi", postal_code: "17121" },
      { city_id: "78", province_id: "9", type: "Kota", city_name: "Bogor", postal_code: "16119" },
      { city_id: "79", province_id: "9", type: "Kabupaten", city_name: "Bogor", postal_code: "16911" },
      { city_id: "103", province_id: "9", type: "Kabupaten", city_name: "Ciamis", postal_code: "46211" },
      { city_id: "104", province_id: "9", type: "Kabupaten", city_name: "Cianjur", postal_code: "43217" },
      { city_id: "107", province_id: "9", type: "Kota", city_name: "Cimahi", postal_code: "40512" },
      { city_id: "108", province_id: "9", type: "Kabupaten", city_name: "Cirebon", postal_code: "45611" },
      { city_id: "109", province_id: "9", type: "Kota", city_name: "Cirebon", postal_code: "45116" },
      { city_id: "115", province_id: "9", type: "Kota", city_name: "Depok", postal_code: "16416" },
      { city_id: "126", province_id: "9", type: "Kabupaten", city_name: "Garut", postal_code: "44126" },
      { city_id: "149", province_id: "9", type: "Kabupaten", city_name: "Indramayu", postal_code: "45214" },
      { city_id: "171", province_id: "9", type: "Kabupaten", city_name: "Karawang", postal_code: "41311" },
      { city_id: "211", province_id: "9", type: "Kabupaten", city_name: "Kuningan", postal_code: "45511" },
      { city_id: "252", province_id: "9", type: "Kabupaten", city_name: "Majalengka", postal_code: "45412" },
      { city_id: "332", province_id: "9", type: "Kabupaten", city_name: "Pangandaran", postal_code: "46511" },
      { city_id: "376", province_id: "9", type: "Kabupaten", city_name: "Purwakarta", postal_code: "41119" },
      { city_id: "428", province_id: "9", type: "Kabupaten", city_name: "Subang", postal_code: "41215" },
      { city_id: "430", province_id: "9", type: "Kabupaten", city_name: "Sukabumi", postal_code: "43311" },
      { city_id: "431", province_id: "9", type: "Kota", city_name: "Sukabumi", postal_code: "43114" },
      { city_id: "440", province_id: "9", type: "Kabupaten", city_name: "Sumedang", postal_code: "45326" },
      { city_id: "468", province_id: "9", type: "Kabupaten", city_name: "Tasikmalaya", postal_code: "46411" },
      { city_id: "469", province_id: "9", type: "Kota", city_name: "Tasikmalaya", postal_code: "46116" },

      // Jawa Tengah (province_id: 10)
      { city_id: "37", province_id: "10", type: "Kabupaten", city_name: "Banjarnegara", postal_code: "53419" },
      { city_id: "41", province_id: "10", type: "Kabupaten", city_name: "Banyumas", postal_code: "53114" },
      { city_id: "49", province_id: "10", type: "Kabupaten", city_name: "Batang", postal_code: "51211" },
      { city_id: "76", province_id: "10", type: "Kabupaten", city_name: "Blora", postal_code: "58219" },
      { city_id: "80", province_id: "10", type: "Kabupaten", city_name: "Boyolali", postal_code: "57319" },
      { city_id: "91", province_id: "10", type: "Kabupaten", city_name: "Brebes", postal_code: "52212" },
      { city_id: "105", province_id: "10", type: "Kabupaten", city_name: "Cilacap", postal_code: "53211" },
      { city_id: "113", province_id: "10", type: "Kabupaten", city_name: "Demak", postal_code: "59519" },
      { city_id: "134", province_id: "10", type: "Kabupaten", city_name: "Grobogan", postal_code: "58111" },
      { city_id: "163", province_id: "10", type: "Kabupaten", city_name: "Jepara", postal_code: "59419" },
      { city_id: "169", province_id: "10", type: "Kabupaten", city_name: "Karanganyar", postal_code: "57718" },
      { city_id: "177", province_id: "10", type: "Kabupaten", city_name: "Kebumen", postal_code: "54319" },
      { city_id: "181", province_id: "10", type: "Kabupaten", city_name: "Kendal", postal_code: "51314" },
      { city_id: "196", province_id: "10", type: "Kabupaten", city_name: "Klaten", postal_code: "57411" },
      { city_id: "209", province_id: "10", type: "Kabupaten", city_name: "Kudus", postal_code: "59311" },
      { city_id: "249", province_id: "10", type: "Kota", city_name: "Magelang", postal_code: "56133" },
      { city_id: "250", province_id: "10", type: "Kabupaten", city_name: "Magelang", postal_code: "56519" },
      { city_id: "344", province_id: "10", type: "Kabupaten", city_name: "Pati", postal_code: "59114" },
      { city_id: "348", province_id: "10", type: "Kota", city_name: "Pekalongan", postal_code: "51122" },
      { city_id: "349", province_id: "10", type: "Kabupaten", city_name: "Pekalongan", postal_code: "51161" },
      { city_id: "352", province_id: "10", type: "Kabupaten", city_name: "Pemalang", postal_code: "52319" },
      { city_id: "375", province_id: "10", type: "Kabupaten", city_name: "Purbalingga", postal_code: "53312" },
      { city_id: "377", province_id: "10", type: "Kabupaten", city_name: "Purworejo", postal_code: "54111" },
      { city_id: "380", province_id: "10", type: "Kabupaten", city_name: "Rembang", postal_code: "59219" },
      { city_id: "386", province_id: "10", type: "Kota", city_name: "Salatiga", postal_code: "50711" },
      { city_id: "398", province_id: "10", type: "Kabupaten", city_name: "Semarang", postal_code: "50511" },
      { city_id: "399", province_id: "10", type: "Kota", city_name: "Semarang", postal_code: "50135" },
      { city_id: "427", province_id: "10", type: "Kabupaten", city_name: "Sragen", postal_code: "57211" },
      { city_id: "433", province_id: "10", type: "Kabupaten", city_name: "Sukoharjo", postal_code: "57514" },
      { city_id: "445", province_id: "10", type: "Kota", city_name: "Surakarta (Solo)", postal_code: "57113" },
      { city_id: "472", province_id: "10", type: "Kabupaten", city_name: "Tegal", postal_code: "52419" },
      { city_id: "473", province_id: "10", type: "Kota", city_name: "Tegal", postal_code: "52114" },
      { city_id: "476", province_id: "10", type: "Kabupaten", city_name: "Temanggung", postal_code: "56212" },
      { city_id: "497", province_id: "10", type: "Kabupaten", city_name: "Wonogiri", postal_code: "57619" },
      { city_id: "498", province_id: "10", type: "Kabupaten", city_name: "Wonosobo", postal_code: "56311" },

      // Jawa Timur (province_id: 11)
      { city_id: "31", province_id: "11", type: "Kabupaten", city_name: "Bangkalan", postal_code: "69118" },
      { city_id: "42", province_id: "11", type: "Kabupaten", city_name: "Banyuwangi", postal_code: "68416" },
      { city_id: "51", province_id: "11", type: "Kota", city_name: "Batu", postal_code: "65311" },
      { city_id: "74", province_id: "11", type: "Kabupaten", city_name: "Blitar", postal_code: "66171" },
      { city_id: "75", province_id: "11", type: "Kota", city_name: "Blitar", postal_code: "66124" },
      { city_id: "81", province_id: "11", type: "Kabupaten", city_name: "Bojonegoro", postal_code: "62119" },
      { city_id: "86", province_id: "11", type: "Kabupaten", city_name: "Bondowoso", postal_code: "68219" },
      { city_id: "133", province_id: "11", type: "Kabupaten", city_name: "Gresik", postal_code: "61115" },
      { city_id: "160", province_id: "11", type: "Kabupaten", city_name: "Jember", postal_code: "68113" },
      { city_id: "164", province_id: "11", type: "Kabupaten", city_name: "Jombang", postal_code: "61415" },
      { city_id: "178", province_id: "11", type: "Kota", city_name: "Kediri", postal_code: "64125" },
      { city_id: "179", province_id: "11", type: "Kabupaten", city_name: "Kediri", postal_code: "64184" },
      { city_id: "222", province_id: "11", type: "Kabupaten", city_name: "Lamongan", postal_code: "62219" },
      { city_id: "243", province_id: "11", type: "Kabupaten", city_name: "Lumajang", postal_code: "67319" },
      { city_id: "247", province_id: "11", type: "Kabupaten", city_name: "Madiun", postal_code: "63153" },
      { city_id: "248", province_id: "11", type: "Kota", city_name: "Madiun", postal_code: "63122" },
      { city_id: "251", province_id: "11", type: "Kabupaten", city_name: "Magetan", postal_code: "63319" },
      { city_id: "256", province_id: "11", type: "Kota", city_name: "Malang", postal_code: "65119" },
      { city_id: "255", province_id: "11", type: "Kabupaten", city_name: "Malang", postal_code: "65163" },
      { city_id: "289", province_id: "11", type: "Kabupaten", city_name: "Mojokerto", postal_code: "61382" },
      { city_id: "290", province_id: "11", type: "Kota", city_name: "Mojokerto", postal_code: "61316" },
      { city_id: "305", province_id: "11", type: "Kabupaten", city_name: "Nganjuk", postal_code: "64419" },
      { city_id: "306", province_id: "11", type: "Kabupaten", city_name: "Ngawi", postal_code: "63219" },
      { city_id: "317", province_id: "11", type: "Kabupaten", city_name: "Pacitan", postal_code: "63512" },
      { city_id: "330", province_id: "11", type: "Kabupaten", city_name: "Pamekasan", postal_code: "69319" },
      { city_id: "342", province_id: "11", type: "Kabupaten", city_name: "Pasuruan", postal_code: "67153" },
      { city_id: "343", province_id: "11", type: "Kota", city_name: "Pasuruan", postal_code: "67118" },
      { city_id: "363", province_id: "11", type: "Kabupaten", city_name: "Ponorogo", postal_code: "63411" },
      { city_id: "369", province_id: "11", type: "Kabupaten", city_name: "Probolinggo", postal_code: "67282" },
      { city_id: "370", province_id: "11", type: "Kota", city_name: "Probolinggo", postal_code: "67215" },
      { city_id: "390", province_id: "11", type: "Kabupaten", city_name: "Sampang", postal_code: "69219" },
      { city_id: "409", province_id: "11", type: "Kabupaten", city_name: "Sidoarjo", postal_code: "61219" },
      { city_id: "418", province_id: "11", type: "Kabupaten", city_name: "Situbondo", postal_code: "68316" },
      { city_id: "441", province_id: "11", type: "Kabupaten", city_name: "Sumenep", postal_code: "69413" },
      { city_id: "444", province_id: "11", type: "Kota", city_name: "Surabaya", postal_code: "60119" },
      { city_id: "487", province_id: "11", type: "Kabupaten", city_name: "Trenggalek", postal_code: "66312" },
      { city_id: "489", province_id: "11", type: "Kabupaten", city_name: "Tuban", postal_code: "62319" },
      { city_id: "492", province_id: "11", type: "Kabupaten", city_name: "Tulungagung", postal_code: "66212" },
    ].filter(c => c.province_id === provinceId);

    return NextResponse.json({
      success: true,
      rajaongkir: {
        results: mockCities.length > 0 ? mockCities : []
      },
      source: 'mock'
    });
  }

  try {
    const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
      headers: {
        'key': apiKey
      }
    }); // RajaOngkir Starter endpoint for city
    
    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
