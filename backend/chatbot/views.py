import os
import json
import requests

from dotenv import load_dotenv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai

load_dotenv()

@csrf_exempt
def chat_view(request):
    try:
        if request.method != "POST":
            return JsonResponse(
                {"error": "Only POST requests are allowed"},
                status=405
            )
        data = json.loads(request.body)
        user_input = data.get("text", "").strip()

        if not user_input:
            return JsonResponse(
                {"error": "No input provided"},
                status=400
            )

        api_key = os.environ.get("GEMINI_API_KEY")

        if not api_key:
            return JsonResponse(
                {"error": "GEMINI_API_KEY not found"},
                status=500
            )

        # Create Gemini client
        client = genai.Client(api_key=api_key)

        print("Calling Gemini...")

        # Gemini Interactions API
        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=user_input
        )
        return JsonResponse(
            {
                "reply": interaction.output_text
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    except Exception as e:

        print("========== CHAT ERROR ==========")
        print(type(e).__name__)
        print(repr(e))

        return JsonResponse(
            {
                "error": str(e),
                "type": type(e).__name__
            },
            status=500
        )

@csrf_exempt
def maps_search_view(request):
    try:
        if request.method!="POST":
            return JsonResponse(
                {"error": "Only POST requests are allowed"},
                status=405
            )
        print("========== MAPS SEARCH ==========")
        data=json.loads(request.body)
        query=data.get("query","").strip()
        latitude=data.get("latitude")
        longitude=data.get("longitude")

        if not query:
            return JsonResponse(
                {"error":"Search query is required"},
                status=400
            )
        if latitude is None or longitude is None:
            return JsonResponse(
                {"error":"Latitude and Longitude are required"},
                status=400
            )
        api_key = os.environ.get("GOOGLE_MAPS_API_KEY")

        print("========== GOOGLE KEY CHECK ==========")

        if api_key:
            print("Key exists:", True)
            print("Key prefix:", api_key[:8])
            print("Key length:", len(api_key))
        else:
            print("Key exists:", False)
        if not api_key:
            return JsonResponse(
                {"error":"GOOGLE_MAPS_API_KEY not found"},
                status=500
            )
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": (
                "places.displayName,"
                "places.formattedAddress,"
                "places.location,"
                "places.rating"
            )
        }

        body = {
            "textQuery": query,
            "locationBias": {
                "circle": {
                    "center": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                    "radius": 5000
                }
            }
        }

        response = requests.post(
            url,
            headers=headers,
            json=body
        )

        response_data = response.json()
        print("========== GOOGLE PLACES RESPONSE ==========")
        print("STATUS:", response.status_code)
        print("RESPONSE:", response_data)

        if response.status_code != 200:
                return JsonResponse(
                    {
                        "error": "Google Places API error",
                        "google_response": response_data
                    },
                    status=response.status_code
                )
        places = []

        for place in response_data.get("places", []):

            places.append({
                "name": place.get("displayName", {}).get("text"),
                "address": place.get("formattedAddress"),
                "latitude": place.get("location", {}).get("latitude"),
                "longitude": place.get("location", {}).get("longitude"),
                "rating": place.get("rating")
            })

        return JsonResponse({
            "places": places
        })

    except json.JSONDecodeError:

        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    except Exception as e:

        print("========== MAPS ERROR ==========")
        print(type(e).__name__)
        print(repr(e))

        return JsonResponse(
            {
                "error": str(e),
                "type": type(e).__name__
            },
            status=500
        )