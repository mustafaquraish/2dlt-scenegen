# Scene Generator for CSCD18 A1 - 2D Light Transport

---

[Open Scene Generator](https://mustafaquraish.github.io/2dlt-scenegen)

---

## How to use

The white circles are the objects in the scene, and the yellow circle is the light source. The line coming out from the light source points in the direction it is facing.

- To add a new object into the scene, click and drag on any empty spot (gray) in the canvas.

- To move an object or the light source, click on it and move it around. You cannot change the size (yet).

- To change the material and refractive index of an object, click on it and update the values.

- To duplicate an object, hover over it and press SPACE. The copy will be on top of the object, so move it.

- To delete an object, middle-click on it.

- To change the direction of the light source, click on it. While the light source is temporarily red, you can change it's direction using the mouse. Click anywhere on the canvas to set the direction.

- By default, walls are diffuse. You will need to change the output code to change this.

- Press the 'Export' button to get a buildScene.c file with your scene. This should work with your A1 code.
