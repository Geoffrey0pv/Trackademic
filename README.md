# Trackademic aplicación web poliglota

## Descripción del proyecto

Trackademic es una plataforma académica ligera que permite a estudiantes y profesores:

1. **Gestionar planes de evaluación** de cada asignatura (actividades + porcentaje).
2. **Registrar y consultar notas** y retroalimentaciones por actividad.
3. **Colaborar mediante comentarios** en planes y calificaciones.
4. **Generar reportes innovadores** (proyección de nota final, heat‑map de carga académica).

El proyecto debe cumplir los Resultados de Aprendizaje (RA) del curso **SID II**:

* **RA3** – Transacciones e integridad en BD relacional (PostgreSQL).
* **RA4** – Diseño y uso de BD NoSQL (MongoDB) justificando su aporte al sistema.

## Requisitos previos

| Herramienta    | Versión mínima          | Instalación                                    |
| -------------- | ----------------------- | ---------------------------------------------- |
| **Python**     | 3.11                    | [python.org](https://www.python.org/)          |
| **Node.js**    | 20.x LTS                | [nodejs.org](https://nodejs.org/)              |
| **PostgreSQL** | 15                      | Brew / Chocolatey / apt                        |
| **MongoDB**    | 7.0 (o Atlas free tier) | [mongodb.com/try](https://www.mongodb.com/try) |
| **Git**        | 2.40                    | –                                              |

---

## 1. Backend (FastAPI + SQLModel)

### 1.1 El primer paso es crear entorno virtual

```bash
# Para crear el entorno virtual en ambos SO's
python -m venv .venv

# Para activar el entorno virtual en Linux/macOS
source .venv/bin/activate
# Para activar el entorno virtual en Windows
.venv\Scripts\activate
```

### 1.2 Segundo, una vez activado el entorno virtual instalar dependencias (asegurate que el archivo requirements.txt este al mismo nivel)

```bash
pip install -r requirements.txt
```

> **Ejemplo de algunas dependencias necesarias:** `fastapi`, `uvicorn[standard]`, `sqlmodel`, `asyncpg`, `motor`, `python-dotenv`, `fastapi-users`.

### 1.3. Config De la DB (LOCAL)

Creamos nuestra base de datos por consola (también se puede realizar desde pgAdmin) esta guia será desde la consola de powershell

1. Nos conectamos como el superusuario postgres


```bash
psql -U postgres -d postgres -h localhost -W
```

2. Ya dentro de psql, creamos el rol y la base de datos de la aplicación:

```bash
CREATE ROLE trackadmin WITH LOGIN PASSWORD 'secret';
CREATE DATABASE university OWNER trackadmin;
\q
```
3. Ubicados en la carperta raiz del proyecto ejecutamos el siguiente comando del script DDL, para la creación de las tablas:

```bash
psql -U trackadmin -d university -f sql/university_schema_postgresql.sql
```
4. Para insertar los datos debemos ir al archivo en la dirección sql/university_full_data_postgresql.sql y copiamos todo el script, abrimos pg admin, 
entramos al servidor y a la db **university** y selecionamos **Querytool** y vamos ejecutando uno por uno los inserts a cada tabla para evitar errors de violaciones de llaves foraneas

5. Creamos un archivo .venv con las credenciales de acceso a la base de datos tanto para Postgres como para mongo

```env
# backend/.env
# ---- PostgreSQL ----
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=trackademic
POSTGRES_USER=trackadmin
POSTGRES_PASSWORD=trackademic

# ---- MongoDB ----
MONGO_URI=mongodb://localhost:27017
MONGO_DB=trackademic

# ---- Seguridad ----
SECRET_KEY=change_me
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 1.4 Ejecutar servidor de desarrollo

1. En la carpeta raiz nos movemos dentro de la carpeta backend y ejecutamos el comando para levantar el servidor de esta forma

```bash
cd backend
uvicorn app.main:app --reload
```

*API disponible en* **[http://127.0.0.1:8000](http://127.0.0.1:8000)** — documentación automática en **/docs** (Swagger UI).

---

## 2. Front‑end (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev    # escucha en http://127.0.0.1:5173
```

La aplicación llama al backend mediante la variable `VITE_API_URL` (ver `frontend/.env`).

---
