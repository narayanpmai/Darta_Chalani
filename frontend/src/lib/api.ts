const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lgoms_token') : null;
  
  // Get active fiscal year ID from localStorage
  let fiscalYearId = null;
  if (typeof window !== 'undefined') {
    const fyStore = localStorage.getItem("lgoms_fiscal_years");
    if (fyStore) {
      try {
        const parsed = JSON.parse(fyStore);
        const active = parsed.find((f: any) => f.isActive);
        if (active) {
          fiscalYearId = active.id;
        }
      } catch {}
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Only add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add Fiscal Year ID header if found
  if (fiscalYearId) {
    headers['X-Fiscal-Year-Id'] = fiscalYearId;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to parse error message from backend
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      if (errorData && errorData.title) {
         errorMessage = errorData.title;
      } else if (errorData && errorData.message) {
         errorMessage = errorData.message;
      } else if (errorData && errorData.errors) {
         errorMessage = Object.values(errorData.errors).flat().join(', ');
      }
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
