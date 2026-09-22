# Brindha Birthday Site

A five-tab birthday microsite for Brindha with a welcome page, photo slideshow, friendship quiz, wishes, and a final celebration interaction.

## Run locally

```powershell
python -m pip install -r requirements.txt
streamlit run app.py
```

Streamlit reads every `.jpg`, `.jpeg`, `.png`, `.webp`, and `.gif` inside `assets/photos`. The home background uses `assets/photos/2.jpeg` at low opacity.

## Publish a public link

The app is already a responsive website powered by Streamlit. To let anyone open it from a phone or laptop:

1. Create a GitHub repository, for example `brindha-birthday`.
2. Upload this whole project, including the `assets/photos` and `assets/videos` folders.
3. Open [Streamlit Community Cloud](https://share.streamlit.io/) and choose **Deploy an app**.
4. Select the repository, branch, and set the main file to `app.py`.
5. Click **Deploy**. Streamlit will provide a public `https://...streamlit.app` link to share.

Keep the repository public, or grant Streamlit access to a private repository. Anyone with the generated link can then open the birthday site on mobile or laptop.
