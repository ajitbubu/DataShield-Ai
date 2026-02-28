import { AdminRole, PermissionKey, rolePermissionMatrix } from "@/data/admin";

export function can(role: AdminRole, permission: PermissionKey) {
  return rolePermissionMatrix[role].includes(permission);
}

export function severityTone(severity: "Low" | "Medium" | "High" | "Critical") {
  if (severity === "Low") return "bg-success/15 text-success";
  if (severity === "Medium") return "bg-warning/15 text-warning";
  return "bg-danger/15 text-danger";
}

export function compliancePath(points: number[], width = 320, height = 90) {
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 100);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * (width - 8) + 4;
      const y = height - ((point - min) / range) * (height - 10) - 5;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}
