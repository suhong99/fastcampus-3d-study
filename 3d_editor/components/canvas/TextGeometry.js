import { ExtrudeGeometry } from "three";

// 2D 도형을 3D로 확장해주는!
class TextGeometry extends ExtrudeGeometry {
  constructor(text, parameters = {}) {
    const font = parameters.font;

    if (font === undefined) {
      super(); // generate default extrude geometry
    } else {
      const shapes = font.generateShapes(text, parameters.size);

      // translate parameters to ExtrudeGeometry API
      parameters.depth =
        parameters.height !== undefined ? parameters.height : 50;

      // defaults
      if (parameters.bevelThickness === undefined)
        parameters.bevelThickness = 10;
      if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
      if (parameters.bevelEnabled === undefined)
        parameters.bevelEnabled = false;

      super(shapes, parameters);
    }

    this.type = "TextGeometry";
    this.text = text;
  }
}

export default TextGeometry;
