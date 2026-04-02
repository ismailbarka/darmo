const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.daro.ma";

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(data: { nameFr: string; nameAr: string }) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
}

export async function fetchProviders(categoryId?: number) {
  const url = categoryId
    ? `${API_BASE_URL}/providers?categoryId=${categoryId}`
    : `${API_BASE_URL}/providers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

export async function createProvider(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/providers`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    let message = error.error || "Failed to create provider";
    if (error.issues) {
      message +=
        ": " +
        error.issues
          .map((i: any) => `${i.path.join(".")}: ${i.message}`)
          .join(", ");
    }
    throw new Error(message);
  }
  return res.json();
}

export async function updateProvider(id: number, formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/providers/${id}`, {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    let message = error.error || "Failed to update provider";
    if (error.issues) {
      message +=
        ": " +
        error.issues
          .map((i: any) => `${i.path.join(".")}: ${i.message}`)
          .join(", ");
    }
    throw new Error(message);
  }
  return res.json();
}

export async function deleteProvider(id: number) {
  const res = await fetch(`${API_BASE_URL}/providers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete provider");
  return res.json();
}

export async function seedProviders() {
  const res = await fetch(`${API_BASE_URL}/providers/seed`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to seed providers");
  return res.json();
}
