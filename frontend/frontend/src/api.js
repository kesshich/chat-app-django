const API_URL = "http://localhost:8000"; 

export async function register(email, password, first_name) {
  const res = await fetch(`${API_URL}/user/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, first_name }),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/user/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function logout(token) {
  const res = await fetch(`${API_URL}/user/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return res.json();
}
