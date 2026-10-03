import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: 'INVALID',
          message: 'Invalid request payload. Expected JSON body with passport and destination.'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { passport, destination } = body || {};

    // Validate that passport and destination are present 3-letter ISO alpha-3 codes
    const isThreeLetterCode = (val: unknown): val is string =>
      typeof val === 'string' && /^[A-Za-z]{3}$/.test(val.trim());

    if (!isThreeLetterCode(passport) || !isThreeLetterCode(destination)) {
      return new Response(
        JSON.stringify({
          error: 'INVALID',
          message: 'Passport and destination must be valid 3-letter ISO country codes (e.g. IND, FRA, JPN).'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const passportCode = passport.trim().toUpperCase();
    const destinationCode = destination.trim().toUpperCase();

    // Read ORIZN_API_KEY from environment secret
    const oriznApiKey = Deno.env.get('ORIZN_API_KEY');
    if (!oriznApiKey) {
      console.error('ORIZN_API_KEY secret is not set in environment.');
      return new Response(
        JSON.stringify({
          error: 'SERVER',
          message: 'Visa API configuration error on server.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Orizn Visa API (always lang=en as required by free tier)
    const oriznUrl = `https://visa.orizn.app/api/v1/visa?passport=${encodeURIComponent(passportCode)}&destination=${encodeURIComponent(destinationCode)}&lang=en`;

    const oriznRes = await fetch(oriznUrl, {
      method: 'GET',
      headers: {
        'x-api-key': oriznApiKey,
        'Accept': 'application/json',
      },
    });

    if (oriznRes.ok) {
      const oriznJson = await oriznRes.json();
      // Orizn response shape: { data: { passport, destination, requirement, ... } }
      const payloadData = oriznJson?.data || oriznJson;
      return new Response(
        JSON.stringify({ data: payloadData }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle and normalize error responses
    const status = oriznRes.status;
    let errorType: 'NO_DATA' | 'QUOTA' | 'INVALID' | 'SERVER' = 'SERVER';
    let errorMessage = 'Visa lookup is busy right now, please try again shortly or contact our team.';

    if (status === 404) {
      errorType = 'NO_DATA';
      errorMessage = "We don't have confirmed data for this route yet — our visa team can help.";
    } else if (status === 429) {
      errorType = 'QUOTA';
      errorMessage = 'Visa lookup is busy right now, please try again shortly or contact our team.';
    } else if (status === 400 || status === 401 || status === 403) {
      errorType = 'INVALID';
      errorMessage = status === 400
        ? 'Invalid country code or unsupported language.'
        : 'Authentication error connecting to visa service.';
    }

    return new Response(
      JSON.stringify({
        error: errorType,
        message: errorMessage
      }),
      {
        status: status >= 400 && status < 600 ? status : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (err: any) {
    console.error('Unhandled error in visa-requirement edge function:', err);
    return new Response(
      JSON.stringify({
        error: 'SERVER',
        message: 'Visa lookup is busy right now, please try again shortly or contact our team.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});