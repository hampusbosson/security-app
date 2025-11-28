export const getGrade = (score: number) => {
  if (score >= 90) return { grade: "A", color: "text-success" };
  if (score >= 80) return { grade: "B", color: "text-primary" };
  if (score >= 70) return { grade: "C", color: "text-warning" };
  if (score >= 60) return { grade: "D", color: "text-warning" };
  return { grade: "F", color: "text-destructive" };
};