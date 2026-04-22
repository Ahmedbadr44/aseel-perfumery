const ImageKit = require("imagekit");

try {
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  });

  const auth = imagekit.getAuthenticationParameters();
  console.log("Success:", auth);
} catch (error) {
  console.error("Error:", error);
}
