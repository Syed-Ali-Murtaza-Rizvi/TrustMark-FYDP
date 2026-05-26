export function initStudents() {
  const stored = localStorage.getItem("students");
  if (!stored) {
    localStorage.setItem("students", JSON.stringify([]));
  }
}
