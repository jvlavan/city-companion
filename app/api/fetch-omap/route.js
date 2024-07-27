const { NextRequest, NextResponse } = require("next/server");
import { headers } from "next/headers";
import axios from "axios";
async function run(lat, long, query) {
  try {
    let response = await axios.get(
      `https://api.olamaps.io/places/v1/autocomplete?location=${lat},${long}&input=${query}&api_key=${process.env.OLA_API}`,
      
 
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching map data", error);
  }
}

export async function POST(request, context) {
  const reschat = await request.json();

  const authorization = headers().get("Authorization");
  console.log(reschat);
  if (authorization != process.env.AUTHORISATION_KEY) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
  }

  const res = await run(reschat.latitude, reschat.longitude, reschat.query);
  //console.log(res);
  if (res) return NextResponse.json({ res }, { status: 200 });
  else return NextResponse.json({ error: "error" }, { status: 403 });
}
