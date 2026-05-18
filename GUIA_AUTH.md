# Guía de Autenticación - Fácil y Simple

## Endpoints disponibles

### 1. Registro con Email (con verificación)

**POST** `/auth/register`

```json
{
  "username": "tu_usuario",
  "email": "tu@email.com",
  "password": "tu_password"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado. Revisa tu email para verificar tu cuenta."
}
```

> Se envía un código de 6 dígitos al email. Si no configuras Resend, el código se imprime en la consola.

---

### 2. Verificar Email

**POST** `/auth/verify-email`

```json
{
  "email": "tu@email.com",
  "code": "123456"
}
```

**Respuesta:**
```json
{
  "message": "Email verificado exitosamente. Ya puedes iniciar sesión."
}
```

---

### 3. Reenviar Código

**POST** `/auth/resend-code`

```json
{
  "email": "tu@email.com"
}
```

---

### 4. Login Normal

**POST** `/auth/login`

```json
{
  "username": "tu_usuario",
  "password": "tu_password"
}
```

> **Importante:** El email debe estar verificado antes de hacer login.

---

### 5. Login Social (OAuth)

#### Google
**POST** `/auth/oauth/google`
```json
{
  "access_token": "token_de_google"
}
```

#### Discord
**POST** `/auth/oauth/discord`
```json
{
  "access_token": "token_de_discord"
}
```

#### GitHub
**POST** `/auth/oauth/github`
```json
{
  "access_token": "token_de_github"
}
```

**Respuesta (todos los OAuth):**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "is_verified": true,
    "oauth_provider": "google"
  }
}
```

---

## Configuración de Resend (Emails)

### Paso 1: Crear cuenta
Ve a https://resend.com y crea una cuenta gratuita.

### Paso 2: Obtener API Key
Crea una API key en el dashboard de Resend.

### Paso 3: Configurar .env
```bash
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_FROM_EMAIL=onboarding@resend.dev  # o tu dominio verificado
```

### Sin Resend (desarrollo local)
Si no configuras Resend, el código de verificación se imprime en la consola del servidor.

---

## Cómo obtener Access Tokens OAuth

### Google
1. Crear proyecto en Google Cloud Console
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Usar el Client ID en tu frontend

### Discord
1. Crear aplicación en https://discord.com/developers/applications
2. En OAuth2 > General, añadir redirect URI
3. Usar Client ID en tu frontend

### GitHub
1. Crear OAuth App en Settings > Developer settings
2. Obtener Client ID
3. Usar en tu frontend

---

## Flujo típico

```
1. Usuario se registra → POST /auth/register
2. Recibe código por email
3. Verifica email → POST /auth/verify-email
4. Hace login → POST /auth/login
5. Recibe JWT token para usar en headers: Authorization: Bearer <token>
```

Para OAuth es más simple:
```
1. Frontend obtiene token del proveedor (Google/Discord/GitHub)
2. Envía token al backend → POST /auth/oauth/google
3. Backend crea/encuentra usuario y devuelve JWT
```
