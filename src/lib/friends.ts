// lib/friends.ts
export async function sendFriendRequest(username: string) {
  const res = await fetch("/api/friends/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUsername: username }),
  });
  return res.json();
}

export async function acceptFriendRequest(requesterId: string) {
  const res = await fetch("/api/friends/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requesterId }),
  });
  return res.json();
}
