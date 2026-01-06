import { NextResponse } from 'next/server';

// City data with region zones for distance-based pricing
const cityZones = {
  // Zone 1: Jawa Tengah (same province as origin - Purworejo)
  "37": 1, "41": 1, "49": 1, "76": 1, "80": 1, "91": 1, "105": 1, "113": 1,
  "134": 1, "163": 1, "169": 1, "177": 1, "181": 1, "196": 1, "209": 1,
  "249": 1, "250": 1, "344": 1, "348": 1, "349": 1, "352": 1, "375": 1,
  "377": 1, "380": 1, "386": 1, "398": 1, "399": 1, "427": 1, "433": 1,
  "445": 1, "472": 1, "473": 1, "476": 1, "497": 1, "498": 1,
  
  // Zone 2: DI Yogyakarta (nearby)
  "39": 2, "135": 2, "210": 2, "419": 2, "501": 2,
  
  // Zone 3: Jawa Timur
  "31": 3, "42": 3, "51": 3, "74": 3, "75": 3, "81": 3, "86": 3, "133": 3,
  "160": 3, "164": 3, "178": 3, "179": 3, "222": 3, "243": 3, "247": 3,
  "248": 3, "251": 3, "255": 3, "256": 3, "289": 3, "290": 3, "305": 3,
  "306": 3, "317": 3, "330": 3, "342": 3, "343": 3, "363": 3, "369": 3,
  "370": 3, "390": 3, "409": 3, "418": 3, "441": 3, "444": 3, "487": 3,
  "489": 3, "492": 3,
  
  // Zone 4: Jawa Barat
  "22": 4, "23": 4, "24": 4, "34": 4, "54": 4, "55": 4, "78": 4, "79": 4,
  "103": 4, "104": 4, "107": 4, "108": 4, "109": 4, "115": 4, "126": 4,
  "149": 4, "171": 4, "211": 4, "252": 4, "332": 4, "376": 4, "428": 4,
  "430": 4, "431": 4, "440": 4, "468": 4, "469": 4,
  
  // Zone 5: DKI Jakarta & Banten
  "151": 5, "152": 5, "153": 5, "154": 5, "155": 5, "189": 5,
  "106": 5, "232": 5, "331": 5, "402": 5, "403": 5, "455": 5, "456": 5, "457": 5,
  
  // Zone 6: Bali
  "17": 6, "32": 6, "94": 6, "114": 6, "128": 6, "161": 6, "170": 6, "197": 6, "447": 6,
  
  // Zone 7: Sumatera (Bengkulu, Jambi, Bangka Belitung)
  "27": 7, "28": 7, "29": 7, "30": 7, "56": 7, "57": 7, "334": 7, // Bangka Belitung
  "62": 7, "63": 7, "64": 7, "65": 7, "175": 7, "183": 7, "233": 7, "294": 7, "379": 7, "397": 7, // Bengkulu
  "50": 7, "97": 7, "156": 7, "194": 7, "280": 7, "293": 7, "393": 7, "442": 7, "460": 7, "461": 7, "471": 7, // Jambi
  
  // Zone 8: Sulawesi (Gorontalo)
  "77": 8, "129": 8, "130": 8, "131": 8, "361": 8,
};

// Base pricing per kg per zone (in Rupiah)
const zonePricing = {
  jne: {
    1: { base: 9000, perKg: 2000 },   // Same province
    2: { base: 11000, perKg: 2500 },  // Nearby (Yogyakarta)
    3: { base: 15000, perKg: 3000 },  // Jawa Timur
    4: { base: 18000, perKg: 3500 },  // Jawa Barat
    5: { base: 20000, perKg: 4000 },  // Jakarta/Banten
    6: { base: 28000, perKg: 5000 },  // Bali
    7: { base: 38000, perKg: 7000 },  // Sumatera
    8: { base: 55000, perKg: 9000 },  // Sulawesi
  },
  pos: {
    1: { base: 8000, perKg: 1800 },
    2: { base: 10000, perKg: 2200 },
    3: { base: 14000, perKg: 2800 },
    4: { base: 17000, perKg: 3200 },
    5: { base: 19000, perKg: 3800 },
    6: { base: 26000, perKg: 4500 },
    7: { base: 35000, perKg: 6500 },
    8: { base: 50000, perKg: 8500 },
  },
  tiki: {
    1: { base: 10000, perKg: 2200 },
    2: { base: 12000, perKg: 2700 },
    3: { base: 16000, perKg: 3200 },
    4: { base: 19000, perKg: 3700 },
    5: { base: 21000, perKg: 4200 },
    6: { base: 30000, perKg: 5500 },
    7: { base: 40000, perKg: 7500 },
    8: { base: 58000, perKg: 9500 },
  },
};

// ETD (Estimated Time of Delivery) per zone in days
const zoneETD = {
  1: { eco: "1-2", reg: "1", express: "1" },
  2: { eco: "1-2", reg: "1", express: "1" },
  3: { eco: "2-3", reg: "1-2", express: "1" },
  4: { eco: "2-4", reg: "2-3", express: "1-2" },
  5: { eco: "2-4", reg: "2-3", express: "1-2" },
  6: { eco: "3-5", reg: "2-3", express: "1-2" },
  7: { eco: "4-7", reg: "3-5", express: "2-3" },
  8: { eco: "5-8", reg: "4-6", express: "2-4" },
};

function calculateShippingCost(destination, weight, courier) {
  const zone = cityZones[destination] || 5; // Default to zone 5 if not found
  const pricing = zonePricing[courier]?.[zone] || zonePricing.jne[zone];
  const etd = zoneETD[zone] || zoneETD[5];
  
  // Weight in kg (minimum 1kg)
  const weightKg = Math.max(1, Math.ceil(weight / 1000));
  
  // Calculate costs for different services
  let costs = [];
  
  if (courier === 'jne') {
    // JNE Services: OKE, REG, YES
    const okePrice = pricing.base + (pricing.perKg * (weightKg - 1));
    const regPrice = Math.round(okePrice * 1.3);
    const yesPrice = Math.round(okePrice * 2.2);
    
    costs = [
      { 
        service: "OKE", 
        description: "Ongkos Kirim Ekonomis", 
        cost: [{ value: okePrice, etd: etd.eco }] 
      },
      { 
        service: "REG", 
        description: "Layanan Reguler", 
        cost: [{ value: regPrice, etd: etd.reg }] 
      },
      { 
        service: "YES", 
        description: "Yakin Esok Sampai", 
        cost: [{ value: yesPrice, etd: etd.express }] 
      }
    ];
  } else if (courier === 'pos') {
    // POS Services
    const paketKilatPrice = pricing.base + (pricing.perKg * (weightKg - 1));
    const expressPrice = Math.round(paketKilatPrice * 1.8);
    
    costs = [
      { 
        service: "Paket Kilat Khusus", 
        description: "Layanan Paket Reguler POS", 
        cost: [{ value: paketKilatPrice, etd: etd.reg }] 
      },
      { 
        service: "Express Next Day", 
        description: "Layanan Express POS", 
        cost: [{ value: expressPrice, etd: etd.express }] 
      }
    ];
  } else if (courier === 'tiki') {
    // TIKI Services: ECO, REG, ONS
    const ecoPrice = pricing.base + (pricing.perKg * (weightKg - 1));
    const regPrice = Math.round(ecoPrice * 1.35);
    const onsPrice = Math.round(ecoPrice * 2.1);
    
    costs = [
      { 
        service: "ECO", 
        description: "Economy Service", 
        cost: [{ value: ecoPrice, etd: etd.eco }] 
      },
      { 
        service: "REG", 
        description: "Regular Service", 
        cost: [{ value: regPrice, etd: etd.reg }] 
      },
      { 
        service: "ONS", 
        description: "Over Night Service", 
        cost: [{ value: onsPrice, etd: etd.express }] 
      }
    ];
  }
  
  return costs;
}

function getMockResponse(destination, weight, courier) {
  const costs = calculateShippingCost(destination, weight, courier);
  
  return {
    success: true,
    rajaongkir: {
      origin_details: {
        city_id: "377",
        city_name: "Purworejo",
        province: "Jawa Tengah"
      },
      destination_details: {
        city_id: destination
      },
      results: [
        {
          code: courier,
          name: courier.toUpperCase(),
          costs: costs
        }
      ]
    },
    source: 'calculated'
  };
}

export async function POST(request) {
  const { destination, weight, courier } = await request.json();
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  
  // Hardcoded Origin (Shop location in Purworejo, Jawa Tengah)
  const ORIGIN_CITY_ID = '377'; // Purworejo

  console.log('=== Shipping Cost Request ===');
  console.log('Origin:', ORIGIN_CITY_ID);
  console.log('Destination:', destination);
  console.log('Weight:', weight);
  console.log('Courier:', courier);
  console.log('API Key exists:', !!apiKey);

  // If no API key, use calculated pricing
  if (!apiKey) {
    console.log('No API key, using calculated pricing');
    return NextResponse.json(getMockResponse(destination, weight, courier));
  }

  try {
    console.log('Calling RajaOngkir API...');
    
    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: ORIGIN_CITY_ID,
        destination: destination,
        weight: weight.toString(),
        courier: courier
      })
    });
    
    const data = await response.json();
    console.log('RajaOngkir Response Status:', data.rajaongkir?.status);
    console.log('RajaOngkir Results:', JSON.stringify(data.rajaongkir?.results?.[0]?.costs?.length || 0), 'cost options');
    
    // Check if API returned valid data
    if (data.rajaongkir?.status?.code === 200 && 
        data.rajaongkir?.results?.[0]?.costs?.length > 0) {
      console.log('✅ Using RajaOngkir API data');
      return NextResponse.json({ success: true, ...data, source: 'rajaongkir' });
    }
    
    // If API returned error or no costs, use calculated pricing
    console.log('⚠️ RajaOngkir returned no costs, falling back to calculated pricing');
    console.log('API Response:', JSON.stringify(data.rajaongkir?.status || data));
    return NextResponse.json(getMockResponse(destination, weight, courier));
    
  } catch (error) {
    console.error('❌ RajaOngkir API error:', error.message);
    // Fallback to calculated pricing on any error
    return NextResponse.json(getMockResponse(destination, weight, courier));
  }
}
