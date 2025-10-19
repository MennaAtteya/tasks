import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "e_tutor_home.json"

REQUIRED_TOP_LEVEL_KEYS = {
    "site", "hero", "categories", "bestSelling", "recent",
    "instructorCta", "topInstructors", "trusted", "footer"
}

def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def validate_structure(data: dict) -> list[str]:
    errors: list[str] = []
    missing = REQUIRED_TOP_LEVEL_KEYS - set(data.keys())
    if missing:
        errors.append(f"Missing top-level keys: {sorted(missing)}")

    # Spot checks
    site = data.get("site", {})
    if not site.get("name"):
        errors.append("site.name is required")
    if not isinstance(site.get("nav", []), list):
        errors.append("site.nav must be a list")

    hero = data.get("hero", {})
    if not hero.get("headline"):
        errors.append("hero.headline is required")

    for section_key in ("bestSelling", "recent"):
        sec = data.get(section_key, {})
        courses = sec.get("courses", [])
        if not isinstance(courses, list) or not courses:
            errors.append(f"{section_key}.courses must be a non-empty list")
        else:
            for idx, c in enumerate(courses[:2]):  # sample first two
                for req in ("category", "price", "title", "rating", "students"):
                    if req not in c:
                        errors.append(f"{section_key}.courses[{idx}] missing {req}")

    instructors = data.get("topInstructors", {}).get("items", [])
    if not instructors:
        errors.append("topInstructors.items must be non-empty")

    return errors

def summarize(data: dict) -> str:
    site = data["site"]["name"]
    nav_labels = ", ".join([n["label"] for n in data["site"].get("nav", [])])
    num_categories = len(data["categories"].get("items", []))
    best_n = len(data["bestSelling"].get("courses", []))
    recent_n = len(data["recent"].get("courses", []))
    instructors_n = len(data["topInstructors"].get("items", []))
    return (
        f"Site: {site}\n"
        f"Nav: {nav_labels}\n"
        f"Categories: {num_categories} | Best selling: {best_n} | Recent: {recent_n}\n"
        f"Top instructors: {instructors_n}"
    )


def main() -> None:
    if not DATA_PATH.exists():
        raise SystemExit(f"Data file not found: {DATA_PATH}")
    data = load_json(DATA_PATH)
    errors = validate_structure(data)
    if errors:
        print("Invalid dataset:\n - " + "\n - ".join(errors))
        raise SystemExit(1)
    print("Dataset OK\n")
    print(summarize(data))

if __name__ == "__main__":
    main()
