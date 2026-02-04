# GoHighLevel / LeadConnector Form – Compliance URLs

Add these links to your opt-in form in the GoHighLevel form builder so the form passes the **Privacy policy & terms links** requirement.

---

## URLs to add on the form

Use your **production domain** so links work for everyone (including when the form is embedded on other sites).

### Privacy Policy
```
https://revolutionai.pro/privacy
```
**Display text suggestion:** Privacy Policy

### Terms of Service
```
https://www.revolutionai.pro/terms
```
**Display text suggestion:** Terms of Service

---

## Optional: www vs non-www

Both work. Pick one and use it consistently on the form:

- **https://revolutionai.pro/privacy**
- **https://revolutionai.pro/terms**

or

- **https://www.revolutionai.pro/privacy**
- **https://www.revolutionai.pro/terms**

---

## Where to add them in the form

1. In the form builder, add a **Text** or **HTML** block near the consent checkbox / submit area.
2. Add something like:
   - “By submitting, you agree to our [Privacy Policy](https://revolutionai.pro/privacy) and [Terms of Service](https://revolutionai.pro/terms). Message and data rates may apply for SMS.”
3. Or add two separate links: “Privacy Policy” and “Terms of Service” with the URLs above.
4. Ensure the links open in a new tab or same window so users can read the policies before or after submitting.

---

## After deployment

If your live site uses a different domain, replace `revolutionai.pro` in the URLs above with your actual domain.  
Vercel project **revolutionai-website** is configured with:

- **revolutionai.pro**
- **www.revolutionai.pro**

So the URLs above are correct for that deployment.
