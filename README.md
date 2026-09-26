# Para San 🪻

Sitio estático de cumpleaños. Publicación prevista en GitHub Pages desde `main` y la raíz del repositorio.

## Archivos

- `index.html`: página y arte integrado.
- `app.js`: juego de planes y envío del formulario.
- `.nojekyll`: sirve los archivos estáticos sin transformación.

No hay dependencia de instalación ni proceso de compilación. Abre un servidor local con `python3 -m http.server 8000` para probarlo. El envío usa FormSubmit hacia la dirección configurada en `app.js`. En un dominio nuevo, el primer envío puede requerir confirmar un correo de activación antes de que lleguen las respuestas.

Una vez creado el repositorio, en Settings → Pages configura Source: Deploy from a branch, Branch: `main`, Folder: `/(root)`. La URL será `https://antuansabe.github.io/<nombre-del-repositorio>/`.

Elige las funciones de cine y revisa horarios o reservaciones con San antes de cerrar el plan. El formulario presenta horarios tentativos y no hace una reserva.
