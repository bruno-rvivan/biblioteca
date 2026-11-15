import requests

BASE_URL = "https://openlibrary.org"
HEADERS = {"User-Agent": "Athanor/1.0"}


def get_book_info_by_title(title: str, limit: int = 10):
    response = requests.get(
        f"{BASE_URL}/search.json",
        params={"q": title, "limit": limit},
        headers=HEADERS,
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("docs", [])
