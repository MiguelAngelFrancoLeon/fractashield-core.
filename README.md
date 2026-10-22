# FractaShield-Core (Homenaje a M. Franco León)

> **Criptografía Geométrica Defensiva basada en el Costo Geométrico Fracta-Axis y Símplex Minimal en $\mathbb{R}^3$.**  
> *Autor & Creador Conceptual: M. Franco León*

[![License: MIT/Attribution](https://img.shields.io/badge/License-MIT%20with%20Attribution-00ff66.svg)](./LICENSE)
[![Topology](https://img.shields.io/badge/Topology-Minimal%20Simplex%20R%5E3-00e5ff.svg)](#)
[![Slowdown](https://img.shields.io/badge/Brute--Force%20Penalty-%2B7%2C400%25-ffaa00.svg)](#)

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
