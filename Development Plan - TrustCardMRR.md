To ship by Monday, use this "ShipFast-adjacent" stack which handles high-traffic social surges and dynamic image generation out of the box:

* **Framework:** Next.js 15+ (App Router) for speed and server-side API proxying.  
* **Styling:** Tailwind CSS \+ daisyUI for instant, polished UI components.  
* **API Interface:** Standard `fetch` with Bearer Token authentication (`tmrr_...`).  
* **Dynamic Assets:** `next/og` for generating real-time social preview images.  
* **Hosting:** Vercel (Edge Functions) to minimize latency for embeddable widgets.

---

### **Phase 1: Friday Night – The "Connection" Logic**

**Goal:** Establish a secure connection to the TrustMRR API and fetch your startup's data.

1. **Project Initialization:** Scaffold the Next.js app.  
2. **API Proxy Route:** Create a server-side route (`/api/verify/[slug]`) to securely call the TrustMRR endpoint `GET /api/v1/startups/{slug}` using your secret `tmrr_` key.  
3. **Basic Data Mapping:** Map the response fields you need: `revenue.mrr`, `growth30d`, `activeSubscriptions`, and `paymentProvider`.

**Cursor Vibe Prompt:**

"Initialize a Next.js 15 app with Tailwind and daisyUI. Create an API route in `/api/verify/[slug]` that fetches startup data from `https://trustmrr.com/api/v1/startups/{slug}`. Use a Bearer token from env variables. Return only the MRR, 30-day growth, active subscriptions, and the verified payment provider name."

---

### **Phase 2: Saturday – The "Visual" Logic**

**Goal:** Design the card and generate the embeddable snippet.

1. **Widget UI:** Build a clean, "Trust Seal" card using daisyUI. Include a green "Verified" checkmark and the text "Verified by TrustMRR".  
2. **Embed Generator:** Create a simple dashboard where you can enter your slug and preview your card.  
3. **Snippet Tool:** Generate an iframe or script-based snippet that other founders (or yourself) can paste into Framer or Webflow.  
4. **Dynamic OG Image:** Implement a route `/api/og/[slug]` that renders the MRR card as a PNG using `ImageResponse`. This allows your card to show up live when you link it on X.

**Cursor Vibe Prompt:**

"Create a React component for a 'TrustCard'. It should look like a sleek professional badge showing '$X,XXX MRR' in bold, a '+X% growth' pill, and a 'Stripe Verified' badge at the bottom. Then, use next/og to create a dynamic image route that renders this exact UI as an image when given a startup slug."

---

### **Phase 3: Sunday – The "Viral" Hook**

**Goal:** Deployment and the "Launch-Ready" polish.

1. **One-Click Share:** Add a "Share to X" button that uses your dynamic OG image link. When shared, it should automatically look like a live revenue report.  
2. **Viral Loop:** At the bottom of the embedded widget, add a tiny "Get your TrustCard" link to drive organic traffic back to your app.  
3. **Vercel Deployment:** Push to Vercel and set your `TRUSTMRR_API_KEY` in the dashboard.

**Cursor Vibe Prompt:**

"Add a 'Share to X' button on the dashboard. When clicked, it should open a tweet intent with the text 'Just verified my revenue with TrustCard\! 🚀' and include the URL to the dynamic OG image we created. Also, add a small 'Powered by TrustCard' footer to the widget that links back to the home page."

---

### **Tactical Marketing Plan (The "Marc Lou" Strategy)**

Once deployed, use your technical solution to solve your marketing pain point:

* **The Reply Game:** Find Marc Lou's latest post about TrustMRR revenue or a new startup launch. Reply with your own live TrustCard image and a link to the tool.  
* **The "Vibe Check":** Position the product as a "transparency tool" for founders who suck at sales. Use the angle: "Let the verified data do the selling for you".  
* **Incentivized Trust:** If you use it on your own landing page, track the conversion lift. A "Verified" badge can increase conversion by up to 40% in some SaaS niches.

### **Implementation Details to Watch**

* **Rate Limits:** The API has a window of 20 requests. Ensure you use Vercel's Edge Caching for the OG image and API proxy to avoid hitting limits during a viral surge.  
* **Currency Formatting:** All API values are in USD cents (e.g., `1000` \= `$10.00`). Divide by 100 before displaying.

