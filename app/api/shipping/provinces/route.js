import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY;

  // Mock Data if no API Key
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      rajaongkir: {
        results: [
          { province_id: "1", province: "Bali" },
          { province_id: "2", province: "Bangka Belitung" },
          { province_id: "3", province: "Banten" },
          { province_id: "4", province: "Bengkulu" },
          { province_id: "5", province: "DI Yogyakarta" },
          { province_id: "6", province: "DKI Jakarta" },
          { province_id: "7", province: "Gorontalo" },
          { province_id: "8", province: "Jambi" },
          { province_id: "9", province: "Jawa Barat" },
          { province_id: "10", province: "Jawa Tengah" },
          { province_id: "11", province: "Jawa Timur" },
        ]
      },
      source: 'mock'
    });
  }

  try {
    const response = await fetch('https://api.rajaongkir.com/starter/province', {
      headers: {
        'key': apiKey
      }
    });
    
    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
