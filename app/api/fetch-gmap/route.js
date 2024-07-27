const { NextRequest, NextResponse } = require("next/server");
import { headers } from "next/headers";
async function run(lat, long) {
  const { getJson } = require("serpapi");
  let result;
  await getJson(
    {
      engine: "google_maps",
      q: "tourist spots",
      ll: `@${lat},${long},15.1z`,
      type: "search",
      api_key: process.env.TURF_API,
    },
    (json) => {
      // console.log(json["local_results"]);
      result = json["local_results"];
    }
  );

  return result;
}

export async function POST(request, context) {
  const reschat = await request.json();

  const authorization = headers().get("Authorization");
  console.log(reschat);
  if (authorization != process.env.AUTHORISATION_KEY) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 403 });
  }

  const res = await run(reschat.latitude, reschat.longitude);
  //console.log(res);
  if (res) return NextResponse.json({ res }, { status: 200 });
  else return NextResponse.json({ error: "error" }, { status: 403 });
}
