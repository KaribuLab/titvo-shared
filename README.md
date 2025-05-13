# Titvo Shared

Biblioteca de código compartido para los proyectos Titvo, que proporciona servicios comunes y utilidades reutilizables en diferentes partes de la aplicación.

## Características

- **Servicio AES**: Servicio de cifrado y descifrado utilizando el algoritmo AES-256-ECB.
- **Servicio de Secretos**: Interfaz abstracta para la recuperación de secretos y claves.
- **Servicio de Configuración**: Interfaz abstracta para acceder a configuraciones.
- **Servicio de Almacenamiento**: Provee funcionalidades para generar URLs firmadas para operaciones de almacenamiento.
- **Manejo de Errores**: Clase base para errores de aplicación personalizados.

## Uso

### Servicio AES

El servicio AES permite cifrar y descifrar datos utilizando el algoritmo AES-256-ECB:

```typescript
import { AesService } from '@titvo/shared';

// Inyectar dependencias en NestJS
@Injectable()
class MiServicio {
  constructor(
    private readonly aesService: AesService
  ) {}

  async procesarDatos(datos: string) {
    // Cifrar datos
    const datosCifrados = await this.aesService.encrypt(datos);
    
    // Descifrar datos
    const datosDescifrados = await this.aesService.decrypt(datosCifrados);
    
    // Lo cifrado y descifrado debe ser igual
    console.log(datos === datosDescifrados); // true
  }
}
```

### Servicios Abstractos

Este paquete proporciona interfaces abstractas que deben ser implementadas para su uso:

- `SecretService`: Para recuperar secretos como claves de API, tokens, etc.
- `ConfigService`: Para recuperar valores de configuración.
- `StorageService`: Para operaciones relacionadas con almacenamiento.

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

Para ejecutar las pruebas en modo observador:

```bash
npm run test:watch
```

## Licencia

Este proyecto está bajo la licencia [Apache 2.0](LICENSE).