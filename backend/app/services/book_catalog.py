import requests


url = "https://openlibrary.org/search.json?q=the+lord+of+the+rings"
headers = {
    "User-Agent": "biblioteca/1.0 (brvvv6@gmail.com)"
}


def get_book_isbn(title: str):
    url = f"https://openlibrary.org/search.json?q={title}"
    headers = {
        "User-Agent": "biblioteca/1.0 (brvvv6@gmail.com)"
    }
    response = requests.get(url, headers=headers)
    livro = response.json()
    if livro["docs"]:
        obj = livro["docs"][0]
        ia = obj['ia']
        for prefixo in ia:
            if prefixo.startswith("isbn_"):
                isbn = prefixo.removeprefix("isbn_")
                return isbn



def get_book_info_by_isbn(isbn: str):
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    headers = {
        "User-Agent": "biblioteca/1.0 (brvvv6@gmail.com)"
    }
    response = requests.get(url, headers=headers)
    livro = response.json()
    if livro:
        return list(livro.values())[0]



def get_book_info_by_title(title: str):
    url = f"https://openlibrary.org/search.json?q={title}"
    headers = {
        "User-Agent": "biblioteca/1.0 (brvvv6@gmail.com)"
    }
    response = requests.get(url, headers=headers)
    livro = response.json()
    if livro["docs"]:
        return livro["docs"]

