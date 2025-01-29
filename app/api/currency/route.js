import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const toCurrency = url.searchParams.get("to") || "USD"; // Default to USD if not specified

  try {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/AED`; // Open Exchange Rate API
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.rates || !data.rates[toCurrency]) {
      throw new Error("Invalid API response");
    }

    return NextResponse.json({
      base: "AED",
      rates: {
        [toCurrency]: data.rates[toCurrency],
      },
      date: data.date,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 });
  }
}
