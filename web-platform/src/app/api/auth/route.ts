import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, referred } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      const response = new Response(
        JSON.stringify({ error: "Invalid email" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );

      response.headers.append(
        "Set-Cookie",
        `email=; HttpOnly; Secure; Max-Age=0; Path=/; SameSite=Strict`,
      );

      return response;
    }

    const maxAge = 3 * 60;
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    response.headers.append(
      "Set-Cookie",
      `email=${email}; HttpOnly; Secure; Max-Age=${maxAge}; Path=/; SameSite=Strict`,
    );

    if (referred && referred.trim() !== "") {
      response.headers.append(
        "Set-Cookie",
        `referred=${referred}; HttpOnly; Secure; Max-Age=${maxAge}; Path=/; SameSite=Strict`,
      );
    }

    return response;
  } catch (error) {
    console.error("Error in POST /api/auth:", error);

    const response = new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );

    response.headers.append(
      "Set-Cookie",
      `email=; HttpOnly; Secure; Max-Age=0; Path=/; SameSite=Strict`,
    );

    return response;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get("email");
    const referredCookie = cookieStore.get("referred");

    if (!emailCookie) {
      return new Response(JSON.stringify({ error: "Email not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        email: emailCookie.value,
        referred: referredCookie?.value || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in GET /api/auth:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
