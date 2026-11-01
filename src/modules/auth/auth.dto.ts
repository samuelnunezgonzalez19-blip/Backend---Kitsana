export interface RegistroDTO {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface LoginDTO {
  correo: string;
  contrasena: string;
}

export interface UsuarioPublico {
  id: string;
  nombre: string;
  correo: string;
}

export interface AuthResponse {
  usuario: UsuarioPublico;
  token: string;
}
