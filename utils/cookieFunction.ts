// utils/cookieFunction.ts
export function setCookie(
    name: string,
    value: string,
    minute?: number,
    secure = true,
    sameSite: 'Strict' | 'Lax' | 'None' = 'Strict'
  ): void {
    if (typeof document !== 'undefined') {
      // Client-side: Use document.cookie
      let expires = "";
      if (minute) {
        const date = new Date();
        expires = "; expires=" + new Date(date.setMinutes(date.getMinutes() + minute)).toUTCString();
      }
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value || "")}${expires}; path=/; ${secure ? "Secure;" : ""} SameSite=${sameSite}`;
    } else {
      // Server-side: You need to set cookies via response headers (e.g., using NextResponse)
      console.warn('setCookie is called on the server. Use server-specific methods (like NextResponse cookies) to set cookies.');
    }
  }
  
  export function getCookie(name: string): string | null {
    if (typeof document !== 'undefined') {
      // Client-side: Read cookies from document.cookie
      const nameEQ = `${encodeURIComponent(name)}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length));
        }
      }
      return null;
    } else {
      // Server-side: Use Next.js's cookies API from next/headers
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      return cookieStore.get(name)?.value || null;
    }
  }
  
  export function eraseCookie(name: string): void {
    if (typeof document !== 'undefined') {
      // Client-side: Remove cookie by setting an expired date
      document.cookie = `${encodeURIComponent(name)}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict`;
    } else {
      // Server-side: Remove cookies via response headers
      console.warn('eraseCookie is called on the server. Use server-specific methods (like NextResponse cookies) to remove cookies.');
    }
  }
  