import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Holy Remedies',
  description: 'Consulta nuestro aviso de privacidad para conocer cómo manejamos tus datos.',
};

export default function AvisoDePrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl mb-8">
        Aviso de Privacidad
      </h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-lg">
          Fecha de última actualización: 24 de julio de 2024.
        </p>
        <p>
          En Holy Remedies ("nosotros", "nuestro"), respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Este Aviso de Privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web (independientemente de dónde lo visites) y te informará sobre tus derechos de privacidad y cómo la ley te protege.
        </p>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">1. Información que recopilamos</h2>
          <p>
            Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre ti, que hemos agrupado de la siguiente manera:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Datos de Identidad:</strong> Incluyen nombre, apellido, nombre de usuario o identificador similar.</li>
            <li><strong>Datos de Contacto:</strong> Incluyen dirección de facturación, dirección de entrega, dirección de correo electrónico y números de teléfono.</li>
            <li><strong>Datos Financieros:</strong> Incluyen detalles de la tarjeta de pago.</li>
            <li><strong>Datos de Transacción:</strong> Incluyen detalles sobre los pagos hacia y desde ti y otros detalles de los productos y servicios que nos has comprado.</li>
            <li><strong>Datos Técnicos:</strong> Incluyen la dirección del protocolo de internet (IP), tus datos de inicio de sesión, tipo y versión del navegador, configuración y ubicación de la zona horaria, tipos y versiones de los plug-in del navegador, sistema operativo y plataforma, y otra tecnología en los dispositivos que utilizas para acceder a este sitio web.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">2. Cómo usamos tus datos personales</h2>
          <p>
            Usaremos tus datos personales solo cuando la ley nos lo permita. Generalmente, usaremos tus datos personales en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Para procesar y entregar tu pedido.</li>
            <li>Para gestionar nuestra relación contigo, lo que incluirá notificarte sobre cambios en nuestros términos o política de privacidad.</li>
            <li>Para administrar y proteger nuestro negocio y este sitio web (incluyendo la resolución de problemas, análisis de datos, pruebas, mantenimiento del sistema, soporte, informes y alojamiento de datos).</li>
            <li>Para enviarte comunicaciones de marketing, si has optado por recibirlas.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">3. Seguridad de los datos</h2>
          <p>
            Hemos implementado medidas de seguridad apropiadas para evitar que tus datos personales se pierdan accidentalmente, se usen o se acceda a ellos de forma no autorizada, se alteren o se divulguen.
          </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold font-headline mt-8 mb-4">4. Derechos ARCO</h2>
            <p>
                Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, por favor contáctanos.
            </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre este aviso de privacidad, puedes contactarnos en:
            <br />
            <strong>Email:</strong> <a href="mailto:contacto@holyremedies.com.mx" className="text-primary hover:underline">contacto@holyremedies.com.mx</a>
          </p>
        </div>
      </div>
    </div>
  );
}
