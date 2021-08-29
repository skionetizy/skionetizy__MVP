async function validateImage(
  file,
  {
    maxWidth = 1920,
    maxHeight = 1080,
    aspectRatio,
    onlyAspectRatio = false,
  } = {}
) {
  try {
    const maxFileSize = 1024 * 1024; //1mb
    const ext = [".jpg", ".jpeg", ".png", ".svg"];
    const filename = file.name;

    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    if (!ext.some((el) => filename.endsWith(el))) {
      throw new Error("only upload images of .jpg,.jpeg,.png,.svg");
    } else if (file.type.match("image.*") && file.size > maxFileSize) {
      throw new Error(
        "The selected image file is too big. Please choose one that is smaller than 1 MB."
      );
    }

    await new Promise((resolve, reject) => {
      img.onload = () => {
        const [ratioWidth, ratioHeight] = aspectRatio || [];

        if (
          onlyAspectRatio === false &&
          (img.width !== maxWidth || img.height !== maxHeight)
        ) {
          reject(
            new Error(
              `The selected image is ${img.width}x${img.height}. Please choose a ${maxWidth}x${maxHeight} image`
            )
          );
        }
        if (
          aspectRatio &&
          ratioWidth / ratioHeight !== img.width / img.height
        ) {
          reject(
            new Error(`Please choose a ${ratioWidth}/${ratioHeight} image`)
          );
        } else {
          resolve(true);
        }
      };
    });

    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

export default validateImage;
