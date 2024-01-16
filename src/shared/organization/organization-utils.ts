export function normalizeOrganizationName(strig: string): string {
  // remove special characters, keep only -
  // replace diacritics with their base character
  return strig
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/ /g, "-")
    .normalize("NFD")
    .toLowerCase();
}
