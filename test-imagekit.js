const ImageKit = require("imagekit");

try {
  const imagekit = new ImageKit({
    publicKey: "public_nVGY+18YoFlQS9rN7/P8EhlDrzU=",
    privateKey: "private_W9ZDUirnyvnzngrFN9PFdTQm9A0=",
    urlEndpoint: "https://ik.imagekit.io/perfumesimgs",
  });

  const auth = imagekit.getAuthenticationParameters();
  console.log("Success:", auth);
} catch (error) {
  console.error("Error:", error);
}
