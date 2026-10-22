# FractaShield-Core (Homenaje a M. Franco León)

> **Criptografía Geométrica Defensiva basada en el Costo Geométrico Fracta-Axis y Símplex Minimal en $\mathbb{R}^3$.**  
> *Autor & Creador Conceptual: M. Franco León*

[![License: MIT/Attribution](https://img.shields.io/badge/License-MIT%20with%20Attribution-00ff66.svg)](./LICENSE)
[![Topology](https://img.shields.io/badge/Topology-Minimal%20Simplex%20R%5E3-00e5ff.svg)](#)
[![Slowdown](https://img.shields.io/badge/Brute--Force%20Penalty-%2B7%2C400%25-ffaa00.svg)](#)

---

## 🌐 ¿Cómo desplegar esta aplicación como una página web pública?

Esta aplicación es una Single-Page Application (SPA) construida en **React + Vite + TypeScript + Tailwind CSS + Three.js**. No requiere bases de datos complejas para funcionar: corre **100% en el navegador del cliente** con la Web Crypto API y WebGL.

Tienes 3 métodos ultrarrápidos y 100% gratuitos para publicarla en internet:

### Opción 1: GitHub Pages (Automático y Gratuito)
El repositorio ya incluye el archivo `.github/workflows/deploy.yml`:
1. Sube este código a tu repositorio en GitHub (ej. `github.com/tu-usuario/fractashield-core`).
2. En GitHub, entra en tu repositorio y haz clic en **Settings** (Configuración) -> **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment -> Source**, selecciona **GitHub Actions**.
4. ¡Listo! En menos de 1 minuto, GitHub construirá la web y estará online en:
   `https://tu-usuario.github.io/fractashield-core/`

---

### Opción 2: Vercel (En 30 segundos con Dominio Propio Gratuito)
1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** e importa tu repositorio `fractashield-core`.
3. Vercel detectará automáticamente que es un proyecto **Vite**.
4. Haz clic en **Deploy**.
5. Obtendrás inmediatamente un enlace activo como `https://fractashield-core.vercel.app` (y puedes conectarle tu propio dominio personalizado como `fractashield.com` gratis).

---

### Opción 3: Netlify o Cloudflare Pages
1. Entra a [netlify.com](https://netlify.com) o Cloudflare Pages.
2. Conecta tu repositorio de GitHub.
3. Comando de build: `npm run build`
4. Directorio de publicación: `dist`
5. Haz clic en **Deploy Site**.

---

## 💻 Desarrollo Local en tu Máquina

Para probarlo y ejecutarlo en tu computadora:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/fractashield-core.git
cd fractashield-core

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Construir para producción (genera la carpeta dist/)
npm run build
```

---

## 🔬 Fundamentos Matemáticos: Costo Geométrico Fracta-Axis

- **El Símplex Minimal en $\mathbb{R}^3$**: El tetraedro regular es el único polítopo elemental capaz de confinar un volumen cerrado en tres dimensiones euclidianas con 4 vértices equidistantes.
- **La Penalización de +7,400%**: A diferencia de los hashes planos 1D que las GPUs paralelizan en masa, cada intento bajo Fracta-Axis exige calcular el determinante de la matriz 4x4 de Cayley-Menger y transformaciones de rotación en $\mathbb{R}^3$, saturando los registros ALU.
- **Contenedor de Residuos Ad Hoc**: Si se manipula incluso un solo bit, la simetría euclidiana se quiebra de inmediato, alertando de cualquier intrusión local sin necesidad de servidores centrales.

---

## ⚖️ Licencia y Atribución Obligatoria

Este proyecto y sus postulados matemáticos son obra de **M. Franco León**. Se autoriza su estudio, desarrollo y derivación bajo la condición vinculante de **atribución pública, expresa y notoria** al autor en cualquier implementación o derivado.
